import { Button, Container, Paper, Stack, Title } from '@mantine/core';
import { Link } from 'react-router-dom';

export function Home() {
  return (
    <Container>
      <Stack gap="xl" mt="md" mb="md">
        <Paper p="md" bg="gray">
          <Title size="h2" c="white">
            ホーム
          </Title>
        </Paper>

        <Button color="red" component={Link} to="score" size="xl">
          点数管理
        </Button>
        <Button color="red" component={Link} to="scoreFlip" size="xl">
          点数管理(修正席用)
        </Button>
        <Button color="gray" component={Link} to="manage" size="xl">
          試合進行管理
        </Button>
      </Stack>
    </Container>
  );
}
