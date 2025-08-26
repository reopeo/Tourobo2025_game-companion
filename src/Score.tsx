import {
  Button,
  Container,
  Group,
  Paper,
  // SegmentedControl,
  Stack,
  Title,
} from '@mantine/core';
import {
  IconMinus,
  IconPlus,
  // IconSquareNumber1Filled,
  // IconSquareNumber2Filled,
} from '@tabler/icons-react';
import * as ROSLIB from '@tier4/roslibjs-foxglove';
import { useEffect, useState } from 'react';
import type { Match, Team } from './msg';
import {
  Command,
  type UpdateScoreRequest,
  type UpdateScoreResponse,
} from './srv';

export function Score() {
  const [red_team, setRedTeam] = useState<Team>({
    name: '',
    id: '',
    university: '',

    unlock: 0,
    type_1_a: 0,
    type_1_b: 0,
    type_1_c: 0,
    type_2_a: 0,
    type_2_b: 0,
    type_2_c: 0,
    type_3_a: 0,
    type_3_b: 0,
    type_3_c: 0,
    v_goal: false,

    score: 0,
  });
  const [blue_team, setBlueTeam] = useState<Team>({
    name: '',
    id: '',
    university: '',

    unlock: 0,
    type_1_a: 0,
    type_1_b: 0,
    type_1_c: 0,
    type_2_a: 0,
    type_2_b: 0,
    type_2_c: 0,
    type_3_a: 0,
    type_3_b: 0,
    type_3_c: 0,
    v_goal: false,

    score: 0,
  });

  const [updateRedScoreSrv, setUpdateRedScoreSrv] =
    useState<ROSLIB.Service<UpdateScoreRequest, UpdateScoreResponse>>();
  const [updateBlueScoreSrv, setUpdateBlueScoreSrv] =
    useState<ROSLIB.Service<UpdateScoreRequest, UpdateScoreResponse>>();

  const [rosConnected, setRosConnected] = useState(false);

  useEffect(() => {
    const ros = new ROSLIB.Ros({ url: `ws://${location.hostname}:8765` });
    ros.on('connection', () => {
      setRosConnected(true);
    });
    ros.on('error', (e) => {
      console.error(e);
      setRosConnected(true);
    });
    ros.on('close', () => {
      setRosConnected(true);
    });
    // TODO 必ず戻す

    const matchSub = new ROSLIB.Topic<Match>({
      ros,
      name: '/match/status',
      messageType: 'game_state_interfaces/msg/Match',
    });
    matchSub.subscribe((msg) => {
      setRedTeam(msg.red_team);
      setBlueTeam(msg.blue_team);
    });

    const updateRedScoreSrv = new ROSLIB.Service<
      UpdateScoreRequest,
      UpdateScoreResponse
    >({
      ros,
      name: `/red/update_score`,
      serviceType: 'game_state_interfaces/srv/UpdateScore',
    });
    setUpdateRedScoreSrv(updateRedScoreSrv);

    const updateBlueScoreSrv = new ROSLIB.Service<
      UpdateScoreRequest,
      UpdateScoreResponse
    >({
      ros,
      name: `/blue/update_score`,
      serviceType: 'game_state_interfaces/srv/UpdateScore',
    });
    setUpdateBlueScoreSrv(updateBlueScoreSrv);

    return () => {
      matchSub.unsubscribe();
      ros.close();
    };
  });

  const updateRedScore = (
    command: (typeof Command)[keyof typeof Command],
    data: number,
  ) => {
    updateRedScoreSrv?.callService({ command, data }, () => {});
  };

  const updateBlueScore = (
    command: (typeof Command)[keyof typeof Command],
    data: number,
  ) => {
    updateBlueScoreSrv?.callService({ command, data }, () => {});
  };

  return !rosConnected ? (
    <Container>
      <Title size="h2" c="red">
        ROSに接続していません。再読込してください。
      </Title>
    </Container>
  ) : (
    <Container>
      <Stack gap="xs" mt="md" mb="md">
        <Paper p="md" bg="gray">
          <Title size="h2" c="white">
            得点入力画面
          </Title>
        </Paper>

        <Paper p="md" bg="gray.1" mb="md">
          <Title size="h3" mb="sm">アンロック</Title>
          <Stack gap="xs">
            <Group gap="xs" grow>
              <Button
                size="xl"
                color="gray"
                onClick={() => {
                  updateRedScore(Command.UNLOCK, -1);
                }}
              >
                <IconMinus />
              </Button>
              <Title size="h1" style={{ textAlign: 'center' }}>
                {red_team.unlock}
              </Title>
              <Button
                size="xl"
                color="red"
                onClick={() => {
                  updateRedScore(Command.UNLOCK, 1);
                }}
              >
                <IconPlus />
              </Button>
            </Group>
            <Group gap="xs" grow>
              <Button
                size="xl"
                color="gray"
                onClick={() => {
                  updateBlueScore(Command.UNLOCK, -1);
                }}
              >
                <IconMinus />
              </Button>
              <Title size="h1" style={{ textAlign: 'center' }}>
                {blue_team.unlock}
              </Title>
              <Button
                size="xl"
                color="blue"
                onClick={() => {
                  updateBlueScore(Command.UNLOCK, 1);
                }}
              >
                <IconPlus />
              </Button>
            </Group>
          </Stack>
        </Paper>

        <Paper p="md" bg="gray.1" mb="md">
          <Title size="h3" mb="sm">ビンゴ得点</Title>
          <Stack gap="xs">
            {['3', '2', '1'].map((row) => (
              <Group key={row} gap="xs" grow>
                {['a', 'b', 'c'].map((col) => {
                  const typeKey = `type_${row}_${col}` as keyof Team;
                  const commandKey = `TYPE_${row.toUpperCase()}_${col.toUpperCase()}` as keyof typeof Command;
                  const cellTitle = `Type ${row}${col.toUpperCase()}`;
                  return (
                    <Paper key={col} p="xs" radius="md" withBorder>
                      <Stack gap={2} align="center">
                        <Title order={5} mb={2}>{cellTitle}</Title>
                        <Group gap={2}>
                          <Button
                            size="sm"
                            color="red"
                            variant="light"
                            onClick={() => updateRedScore(Command[commandKey], -1)}
                          >
                            <IconMinus size={16} />
                          </Button>
                          <Title order={4} c="red">{red_team[typeKey]}</Title>
                          <Button
                            size="sm"
                            color="red"
                            variant="light"
                            onClick={() => updateRedScore(Command[commandKey], 1)}
                          >
                            <IconPlus size={16} />
                          </Button>
                        </Group>
                        <Group gap={2}>
                          <Button
                            size="sm"
                            color="blue"
                            variant="light"
                            onClick={() => updateBlueScore(Command[commandKey], -1)}
                          >
                            <IconMinus size={16} />
                          </Button>
                          <Title order={4} c="blue">{blue_team[typeKey]}</Title>
                          <Button
                            size="sm"
                            color="blue"
                            variant="light"
                            onClick={() => updateBlueScore(Command[commandKey], 1)}
                          >
                            <IconPlus size={16} />
                          </Button>
                        </Group>
                      </Stack>
                    </Paper>
                  );
                })}
              </Group>
            ))}
          </Stack>
        </Paper>

        <Paper p="md" bg="gray.1" mb="md">
          <Title size="h3" mb="sm">Vゴール</Title>
          <Stack gap="xs">
            <Button
              fullWidth
              size="xl"
              color={red_team.v_goal ? 'green' : 'red'}
              onClick={() => {
                updateRedScore(Command.V_GOAL, red_team.v_goal ? 0 : 1);
              }}
            >
              {red_team.v_goal ? '赤チーム Vゴール済み' : '赤チーム Vゴール'}
            </Button>
            <Button
              fullWidth
              size="xl"
              color={blue_team.v_goal ? 'green' : 'blue'}
              onClick={() => {
                updateBlueScore(Command.V_GOAL, blue_team.v_goal ? 0 : 1);
              }}
            >
              {blue_team.v_goal ? '青チーム Vゴール済み' : '青チーム Vゴール'}
            </Button>
          </Stack>
        </Paper>

        {/* <SegmentedControl
          fullWidth
          size="xl"
          color={team.is_auto ? 'green' : zone}
          value={team.is_auto ? 'auto' : 'manual'}
          data={[
            { value: 'manual', label: '手動' },
            { value: 'auto', label: '自動' },
          ]}
          onChange={(value) => {
            updateScore(Command.IS_AUTO, value === 'auto' ? 1 : 0);
          }}
        />

        <Group gap="xs" grow>
          <Button
            size="xl"
            color="gray"
            onClick={() => {
              updateScore(Command.SEEDLINGS, -1);
            }}
          >
            <IconMinus />
          </Button>
          <Title size="h1" style={{ textAlign: 'center' }}>
            {team.seedlings}
          </Title>
          <Button
            size="xl"
            color={zone}
            onClick={() => {
              updateScore(Command.SEEDLINGS, 1);
            }}
          >
            <IconPlus />
          </Button>
        </Group>

        <Button
          fullWidth
          size="xl"
          color={team.immigration ? 'green' : zone}
          onClick={() => {
            updateScore(Command.IMMIGRATION, team.immigration ? 0 : 1);
          }}
        >
          {team.immigration ? '入国済み' : '入国'}
        </Button>

        <Group gap="xs" grow>
          <Button
            size="xl"
            color={team.type_1_a ? 'orange' : 'gray'}
            onClick={() => {
              updateScore(Command.TYPE_1_A, team.type_1_a ? 0 : 1);
            }}
          >
            <IconSquareNumber1Filled />
          </Button>
          <Button
            size="xl"
            color={team.type_2 ? 'green' : 'gray'}
            onClick={() => {
              updateScore(Command.TYPE_2, team.type_2 ? 0 : 1);
            }}
          >
            <IconSquareNumber2Filled />
          </Button>
          <Button
            size="xl"
            color={team.type_1_b ? 'orange' : 'gray'}
            onClick={() => {
              updateScore(Command.TYPE_1_B, team.type_1_b ? 0 : 1);
            }}
          >
            <IconSquareNumber1Filled />
          </Button>
        </Group>

        <Button
          fullWidth
          size="xl"
          color={team.v_goal ? 'green' : zone}
          onClick={() => {
            updateScore(Command.V_GOAL, team.v_goal ? 0 : 1);
          }}
        >
          {team.v_goal ? 'Vゴール済み' : 'Vゴール'}
        </Button> */}
      </Stack>
    </Container>
  );
}
