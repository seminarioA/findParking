import asyncio
import pathlib
import sys
from contextlib import suppress

ROOT_DIR = pathlib.Path(__file__).resolve().parents[1]
if str(ROOT_DIR) not in sys.path:
    sys.path.append(str(ROOT_DIR))

from api.video import main as video_main


class DummyRedis:
    def __init__(self):
        self.counter = 0

    def get(self, key: str):
        self.counter += 1
        return f"frame-{self.counter}".encode()


async def _run_spmc_flow(monkeypatch):
    # Ensure clean state
    for task in list(video_main.producer_tasks.values()):
        task.cancel()
        with suppress(asyncio.CancelledError):
            await task
    video_main.stream_consumers.clear()
    video_main.producer_tasks.clear()

    monkeypatch.setattr(video_main, "redis_client", DummyRedis())
    original_interval = video_main.POLL_INTERVAL
    video_main.POLL_INTERVAL = 0.001

    stream_key1, queue1 = await video_main._register_consumer("cam1", "processed")
    stream_key2, queue2 = await video_main._register_consumer("cam1", "processed")

    assert stream_key1 == stream_key2
    assert len(video_main.producer_tasks) == 1

    frame1 = await asyncio.wait_for(queue1.get(), timeout=0.5)
    frame2 = await asyncio.wait_for(queue2.get(), timeout=0.5)
    assert frame1 == frame2

    await video_main._unregister_consumer(stream_key1, queue1)
    await video_main._unregister_consumer(stream_key2, queue2)

    await asyncio.wait_for(_wait_for_cleanup(stream_key1), timeout=0.5)

    # Restore and cleanup
    video_main.POLL_INTERVAL = original_interval
    for task in list(video_main.producer_tasks.values()):
        task.cancel()
        with suppress(asyncio.CancelledError):
            await task
    video_main.stream_consumers.clear()
    video_main.producer_tasks.clear()


async def _wait_for_cleanup(stream_key: str):
    while stream_key in video_main.producer_tasks:
        await asyncio.sleep(0.01)


def test_single_producer_multiple_consumers(monkeypatch):
    asyncio.run(_run_spmc_flow(monkeypatch))
