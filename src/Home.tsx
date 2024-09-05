import { Button, Container, Stack } from '@mantine/core';
import { Link } from 'react-router-dom';

export function Home() {
  return (
    <Container>
      <Stack>
        <Button color="red" component={Link} to="red">
          赤ゾーン
        </Button>
        <Button color="blue" component={Link} to="blue">
          青ゾーン
        </Button>
        <Button color="gray" component={Link} to="manage">
          試合進行
        </Button>
      </Stack>
    </Container>
  );
}
