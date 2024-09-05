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
  IconBoxAlignBottomFilled,
  IconMinus,
  IconPlus,
  IconSquareFilled,
} from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import type { Match, Team } from './msg';
import * as ROSLIB from '@tier4/roslibjs-foxglove';
import {
  Command,
  type UpdateScoreRequest,
  type UpdateScoreResponse,
} from './srv';

interface Props {
  zone: 'red' | 'blue';
}

export function Score({ zone }: Props) {
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

  useEffect(() => {
    const ros = new ROSLIB.Ros({ url: 'ws://192.168.0.118:8765' });

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

  return (
    <Container>
      <Stack gap="xl" mt="md" mb="md">
        <Paper p="md" bg={zone}>
          <Title size="h2" c="white">
            得点入力画面
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
            updateScoreSrv?.callService(
              { command: Command.IS_AUTO, data: value === 'auto' ? 1 : 0 },
              () => {},
            );
          }}
        />

        <Group gap="xs" grow>
          <Button
            size="xl"
            color="gray"
            onClick={() => {
              updateScoreSrv?.callService(
                { command: Command.SEEDLINGS, data: -1 },
                () => {},
              );
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
              updateScoreSrv?.callService(
                { command: Command.SEEDLINGS, data: 1 },
                () => {},
              );
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
            updateScoreSrv?.callService(
              {
                command: Command.IMMIGRATION,
                data: team.immigration ? 0 : 1,
              },
              () => {},
            );
          }}
        >
          {team.immigration ? '入国済み' : '入国'}
        </Button>

        <Group gap="xs" grow>
          <Button
            size="xl"
            color={team.type_1_a ? 'orange' : 'gray'}
            onClick={() => {
              updateScoreSrv?.callService(
                {
                  command: Command.TYPE_1_A,
                  data: team.type_1_a ? 0 : 1,
                },
                () => {},
              );
            }}
          >
            <IconBoxAlignBottomFilled />
          </Button>
          <Button
            size="xl"
            color={team.type_2 ? 'green' : 'gray'}
            onClick={() => {
              updateScoreSrv?.callService(
                {
                  command: Command.TYPE_2,
                  data: team.type_2 ? 0 : 1,
                },
                () => {},
              );
            }}
          >
            <IconSquareFilled />
          </Button>
          <Button
            size="xl"
            color={team.type_1_b ? 'orange' : 'gray'}
            onClick={() => {
              updateScoreSrv?.callService(
                {
                  command: Command.TYPE_1_B,
                  data: team.type_1_b ? 0 : 1,
                },
                () => {},
              );
            }}
          >
            <IconBoxAlignBottomFilled />
          </Button>
        </Group>

        <Button
          fullWidth
          size="xl"
          color={team.v_goal ? 'green' : zone}
          onClick={() => {
            updateScoreSrv?.callService(
              {
                command: Command.V_GOAL,
                data: team.v_goal ? 0 : 1,
              },
              () => {},
            );
          }}
        >
          {team.v_goal ? 'Vゴール済み' : 'Vゴール'}
        </Button>
      </Stack>
    </Container>
  );
}
