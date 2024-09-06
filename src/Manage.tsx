import {
  Button,
  Code,
  Container,
  Paper,
  SimpleGrid,
  Stack,
  Title,
} from '@mantine/core';
import * as ROSLIB from '@tier4/roslibjs-foxglove';
import { useEffect, useState } from 'react';
import type { Match } from './msg';

export function Manage() {
  const [match, setMatch] = useState<Match>();

  const [loadNextSrv, setLoadNextSrv] = useState<ROSLIB.Service>();
  const [startSrv, setStartSrv] = useState<ROSLIB.Service>();
  const [redRefereeCallSrv, setRedRefereeCallSrv] = useState<ROSLIB.Service>();
  const [blueRefereeCallSrv, setBlueRefereeCallSrv] =
    useState<ROSLIB.Service>();
  const [confirmSrv, setConfirmSrv] = useState<ROSLIB.Service>();

  useEffect(() => {
    const ros = new ROSLIB.Ros({ url: `ws://${location.hostname}:8765` });

    const matchSub = new ROSLIB.Topic<Match>({
      ros,
      name: '/match/status',
      messageType: 'game_state_interfaces/msg/Match',
    });
    matchSub.subscribe((msg) => {
      setMatch(msg);
    });

    const loadNextSrv = new ROSLIB.Service({
      ros,
      name: '/match/load_next',
      serviceType: 'std_srvs/srv/Empty',
    });
    setLoadNextSrv(loadNextSrv);

    const startSrv = new ROSLIB.Service({
      ros,
      name: '/match/start',
      serviceType: 'std_srvs/srv/Empty',
    });
    setStartSrv(startSrv);

    const redRefereeCallSrv = new ROSLIB.Service({
      ros,
      name: '/red/referee_call',
      serviceType: 'std_srvs/srv/Empty',
    });
    setRedRefereeCallSrv(redRefereeCallSrv);

    const blueRefereeCallSrv = new ROSLIB.Service({
      ros,
      name: '/blue/referee_call',
      serviceType: 'std_srvs/srv/Empty',
    });
    setBlueRefereeCallSrv(blueRefereeCallSrv);

    const confirmSrv = new ROSLIB.Service({
      ros,
      name: '/match/confirm',
      serviceType: 'std_srvs/srv/Empty',
    });
    setConfirmSrv(confirmSrv);

    return () => {
      matchSub.unsubscribe();
      ros.close();
    };
  }, []);

  return (
    <Container>
      <Stack gap="xl" mt="md" mb="md">
        <Paper p="md" bg="gray">
          <Title size="h2" c="white">
            試合進行管理
          </Title>
        </Paper>

        <SimpleGrid cols={2}>
          <Stack gap="xl" mt="md" mb="md">
            <Button
              size="xl"
              onClick={() => loadNextSrv?.callService({}, () => {})}
            >
              次の試合を読み込み
            </Button>

            <Button
              size="xl"
              onClick={() => startSrv?.callService({}, () => {})}
            >
              試合開始
            </Button>

            <Button
              size="xl"
              onClick={() => redRefereeCallSrv?.callService({}, () => {})}
            >
              赤ゾーン審判呼出
            </Button>

            <Button
              size="xl"
              onClick={() => blueRefereeCallSrv?.callService({}, () => {})}
            >
              青ゾーン審判呼出
            </Button>

            <Button
              size="xl"
              onClick={() => confirmSrv?.callService({}, () => {})}
            >
              試合結果確定
            </Button>
          </Stack>

          <Code block>{JSON.stringify(match, undefined, 2)}</Code>
        </SimpleGrid>
      </Stack>
    </Container>
  );
}
