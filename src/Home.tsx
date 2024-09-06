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

        <Button color="red" component={Link} to="red" size="xl">
          赤ゾーン
        </Button>
        <Button color="blue" component={Link} to="blue" size="xl">
          青ゾーン
        </Button>
        <Button color="gray" component={Link} to="manage" size="xl">
          試合進行管理
        </Button>
      </Stack>
    </Container>
  );
}
