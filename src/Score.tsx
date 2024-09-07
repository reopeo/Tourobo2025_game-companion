import {
  Button,
  Container,
  Group,
  Paper,
  SegmentedControl,
  Stack,
  Title,
} from '@mantine/core';
import {
  IconMinus,
  IconPlus,
  IconSquareNumber1Filled,
  IconSquareNumber2Filled,
} from '@tabler/icons-react';
import * as ROSLIB from '@tier4/roslibjs-foxglove';
import { useEffect, useState } from 'react';
import type { Match, Team } from './msg';
import {
  Command,
  type UpdateScoreRequest,
  type UpdateScoreResponse,
} from './srv';

interface ScoreProps {
  zone: 'red' | 'blue';
}

export function Score({ zone }: ScoreProps) {
  const [team, setTeam] = useState<Team>({
    name: '',
    id: '',
    university: '',
    is_auto: false,

    seedlings: 0,
    immigration: false,
    type_1_a: false,
    type_1_b: false,
    type_2: false,
    v_goal: false,

    score: 0,
  });

  const [updateScoreSrv, setUpdateScoreSrv] =
    useState<ROSLIB.Service<UpdateScoreRequest, UpdateScoreResponse>>();

  const [rosConnected, setRosConnected] = useState(false);

  useEffect(() => {
    const ros = new ROSLIB.Ros({ url: `ws://${location.hostname}:8765` });
    ros.on('connection', () => {
      setRosConnected(true);
    });
    ros.on('error', (e) => {
      console.error(e);
      setRosConnected(false);
    });
    ros.on('close', () => {
      setRosConnected(false);
    });

    const matchSub = new ROSLIB.Topic<Match>({
      ros,
      name: '/match/status',
      messageType: 'game_state_interfaces/msg/Match',
    });
    matchSub.subscribe((msg) => {
      setTeam(zone === 'red' ? msg.red_team : msg.blue_team);
    });

    const updateScoreSrv = new ROSLIB.Service<
      UpdateScoreRequest,
      UpdateScoreResponse
    >({
      ros,
      name: `/${zone}/update_score`,
      serviceType: 'game_state_interfaces/srv/UpdateScore',
    });
    setUpdateScoreSrv(updateScoreSrv);

    return () => {
      matchSub.unsubscribe();
      ros.close();
    };
  }, [zone]);

  const updateScore = (
    command: (typeof Command)[keyof typeof Command],
    data: number,
  ) => {
    updateScoreSrv?.callService({ command, data }, () => {});
  };

  return (
    <Container>
      <Stack gap="xl" mt="md" mb="md">
        <Paper p="md" bg={zone}>
          <Title size="h2" c="white">
            得点入力画面 [{rosConnected ? '接続済' : '未接続'}]
          </Title>
        </Paper>

        <SegmentedControl
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
        </Button>
      </Stack>
    </Container>
  );
}
