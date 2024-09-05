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
import { useState } from 'react';
import type { Team } from './msg';

interface Props {
  zone: 'red' | 'blue';
}

export function App({ zone }: Props) {
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

  const updateTeam = (fn: (prev: Team) => Partial<Team>) => {
    setTeam((team) => ({ ...structuredClone(team), ...fn(team) }));
  };

  return (
    <Container>
      <Stack gap="xl" mt="md" mb="md">
        <Paper p="md" bg={zone}>
          <Title size="h2" c="white">
            得点入力画面
          </Title>
        </Paper>

        <Stack gap="xs">
          <SegmentedControl
            fullWidth
            size="xl"
            color={team.is_auto ? 'green' : 'blue'}
            value={team.is_auto ? 'auto' : 'manual'}
            data={[
              { value: 'manual', label: '手動' },
              { value: 'auto', label: '自動' },
            ]}
            onChange={(value) =>
              updateTeam(() => ({ is_auto: value === 'auto' }))
            }
          />
        </Stack>

        <Stack gap="xs">
          <Group gap="xs" grow>
            <Button
              size="xl"
              color="gray"
              onClick={() =>
                updateTeam((team) => ({ seedlings: team.seedlings - 1 }))
              }
            >
              <IconMinus />
            </Button>
            <Title size="h1" style={{ textAlign: 'center' }}>
              {team.seedlings}
            </Title>
            <Button
              size="xl"
              color="blue"
              onClick={() =>
                updateTeam((team) => ({ seedlings: team.seedlings + 1 }))
              }
            >
              <IconPlus />
            </Button>
          </Group>
        </Stack>

        <Stack gap="xs">
          <SegmentedControl
            fullWidth
            size="xl"
            color={team.immigration ? 'green' : 'blue'}
            value={team.immigration ? 'done' : 'not_yet'}
            data={[
              { value: 'not_yet', label: '未入国' },
              { value: 'done', label: '入国済' },
            ]}
            onChange={(value) =>
              updateTeam(() => ({ immigration: value === 'done' }))
            }
          />
        </Stack>

        <Group gap="xs" grow>
          <Button
            size="xl"
            color={team.type_1_a ? 'orange' : 'gray'}
            onClick={() => updateTeam((team) => ({ type_1_a: !team.type_1_a }))}
          >
            <IconBoxAlignBottomFilled />
          </Button>
          <Button
            size="xl"
            color={team.type_2 ? 'green' : 'gray'}
            onClick={() => updateTeam((team) => ({ type_2: !team.type_2 }))}
          >
            <IconSquareFilled />
          </Button>
          <Button
            size="xl"
            color={team.type_1_b ? 'orange' : 'gray'}
            onClick={() => updateTeam((team) => ({ type_1_b: !team.type_1_b }))}
          >
            <IconBoxAlignBottomFilled />
          </Button>
        </Group>
      </Stack>
    </Container>
  );
}
