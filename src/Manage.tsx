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
import {
  type EndMatchRequest,
  type EndMatchResponse,
  RefereeCall,
} from './srv';

export function Manage() {
  const [match, setMatch] = useState<Match>();

  const [loadNextSrv, setLoadNextSrv] = useState<ROSLIB.Service>();
  const [startSrv, setStartSrv] = useState<ROSLIB.Service>();
  const [resetSrv, setResetSrv] = useState<ROSLIB.Service>();
  const [endSrv, setEndSrv] =
    useState<ROSLIB.Service<EndMatchRequest, EndMatchResponse>>();

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

    const resetSrv = new ROSLIB.Service({
      ros,
      name: '/match/reset',
      serviceType: 'std_srvs/srv/Empty',
    });
    setResetSrv(resetSrv);

    const endSrv = new ROSLIB.Service<EndMatchRequest, EndMatchResponse>({
      ros,
      name: '/match/end',
      serviceType: 'game_state_interfaces/srv/EndMatch',
    });
    setEndSrv(endSrv);

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
              color="gray"
              onClick={() => {
                if (confirm('次の試合を読み込みますか？')) {
                  loadNextSrv?.callService({}, () => {});
                }
              }}
            >
              次の試合を読み込み
            </Button>

            <Button
              size="xl"
              color="gray"
              onClick={() => {
                if (confirm('試合開始しますか？')) {
                  startSrv?.callService({}, () => {});
                }
              }}
            >
              試合開始
            </Button>

            <Button
              size="xl"
              color="gray"
              onClick={() => {
                if (confirm('再試合しますか？')) {
                  resetSrv?.callService({}, () => {});
                }
              }}
            >
              再試合
            </Button>

            <Button
              size="xl"
              color="gray"
              onClick={() => {
                if (confirm('試合終了 (通常) しますか？')) {
                  endSrv?.callService(
                    { referee_call: RefereeCall.NONE },
                    () => {},
                  );
                }
              }}
            >
              試合終了 (通常)
            </Button>

            <Button
              size="xl"
              color="red"
              onClick={() => {
                if (confirm('試合終了 (審判判定赤) しますか？')) {
                  endSrv?.callService(
                    { referee_call: RefereeCall.RED },
                    () => {},
                  );
                }
              }}
            >
              試合終了 (審判判定赤)
            </Button>

            <Button
              size="xl"
              color="blue"
              onClick={() => {
                if (confirm('試合終了 (審判判定青) しますか？')) {
                  endSrv?.callService(
                    { referee_call: RefereeCall.BLUE },
                    () => {},
                  );
                }
              }}
            >
              試合終了 (審判判定青)
            </Button>
          </Stack>

          <Code block>{JSON.stringify(match, undefined, 2)}</Code>
        </SimpleGrid>
      </Stack>
    </Container>
  );
}
