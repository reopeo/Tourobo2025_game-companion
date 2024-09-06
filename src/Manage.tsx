import { Container, Stack, Paper, Title, Button } from '@mantine/core';

export function Manage() {
  return (
    <Container>
      <Stack gap="xl" mt="md" mb="md">
        <Paper p="md" bg="gray">
          <Title size="h2" c="white">
            試合進行管理
          </Title>
        </Paper>

        <Button size="xl">試合結果確定</Button>
      </Stack>
    </Container>
  );
}
