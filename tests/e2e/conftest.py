import pytest
from playwright.sync_api import Page


def pytest_configure(config):
    config.addinivalue_line("markers", "smoke: testes rápidos de fumaça")


@pytest.fixture(scope="session")
def browser_context_args(browser_context_args):
    return {**browser_context_args, "viewport": {"width": 1280, "height": 720}}


@pytest.fixture
def page(page: Page):
    page.set_default_timeout(15000)
    yield page
