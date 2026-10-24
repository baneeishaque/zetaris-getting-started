#!/usr/bin/env python3
"""Copy selected Zetaris plans into the public repo and sanitize them."""

from __future__ import annotations

import re
from pathlib import Path

REPO = Path("/home/ext_root/lab-data/zetaris-getting-started")
AI_SUITE = Path("/home/ext_root/lab-data/ai-suite")

COPIES = [
    (
        REPO
        / "docs/plans/2026-10-23_e95db8a7dffeuYlna87fyPRaWJ_eurostat-data-dossier-and-angular-crud_implementation-plan_v1.md",
        REPO / "docs/plans/2026-10-23_eurostat-data-dossier-and-angular-crud_implementation-plan_v1.md",
    ),
    (
        REPO
        / "docs/plans/2026-10-23_e95db8a7dffeuYlna87fyPRaWJ_eurostat-data-dossier-and-angular-crud_task.md",
        REPO / "docs/plans/2026-10-23_eurostat-data-dossier-and-angular-crud_task.md",
    ),
    (
        AI_SUITE
        / "docs/implementation-plans/2026-10-23_e95d21195ffeZqxeyL3fMHbTW4_onboarding-dry-run-with-rest-sql-checks-fork-1_implementation-plan_v2.md",
        REPO / "docs/plans/2026-10-23_eurostat-crud-java_implementation-plan_v2.md",
    ),
    (
        AI_SUITE
        / "docs/2026-10-23_e95d21195ffeZqxeyL3fMHbTW4_onboarding-dry-run-with-rest-sql-checks-fork-1_task.md",
        REPO / "docs/plans/2026-10-23_eurostat-crud-java_task.md",
    ),
    (
        AI_SUITE
        / "docs/implementation-plans/2026-10-23_e95d21195ffeZqxeyL3fMHbTW4_onboarding-dry-run-with-rest-sql-checks-fork-1_implementation-plan_v1.md",
        REPO / "docs/plans/archive/2026-10-23_eurostat-crud-java_implementation-plan_v1.md",
    ),
    (
        AI_SUITE
        / "docs/implementation-plans/2026-10-20_ea69411d4ffehAhCZh8fxE6Ku3_clone-getting-started-to-lab-data-and-plan-zetaris-setup_implementation-plan_v1.md",
        REPO / "docs/plans/archive/2026-10-20_zetaris-local-setup_implementation-plan_v1.md",
    ),
    (
        AI_SUITE
        / "docs/implementation-plans/2026-10-20_ea69411d4ffehAhCZh8fxE6Ku3_clone-getting-started-to-lab-data-and-plan-zetaris-setup_implementation-plan_v2.md",
        REPO / "docs/plans/archive/2026-10-20_zetaris-local-setup_implementation-plan_v2.md",
    ),
    (
        AI_SUITE
        / "docs/2026-10-20_ea69411d4ffehAhCZh8fxE6Ku3_clone-getting-started-to-lab-data-and-plan-zetaris-setup_task.md",
        REPO / "docs/plans/archive/2026-10-20_zetaris-local-setup_task.md",
    ),
]

FILENAME_REPLACEMENTS = [
    (
        "2026-10-23_e95db8a7dffeuYlna87fyPRaWJ_eurostat-data-dossier-and-angular-crud",
        "2026-10-23_eurostat-data-dossier-and-angular-crud",
    ),
    (
        "2026-10-23_e95d21195ffeZqxeyL3fMHbTW4_onboarding-dry-run-with-rest-sql-checks-fork-1",
        "2026-10-23_eurostat-crud-java",
    ),
    (
        "2026-10-20_ea69411d4ffehAhCZh8fxE6Ku3_clone-getting-started-to-lab-data-and-plan-zetaris-setup",
        "2026-10-20_zetaris-local-setup",
    ),
]

SESSION_REPLACEMENTS = [
    ("ses_e95db8a7dffeuYlna87fyPRaWJ", "local-session"),
    ("e95db8a7dffeuYlna87fyPRaWJ", "local-session"),
    ("ses_e95d21195ffeZqxeyL3fMHbTW4", "local-session"),
    ("e95d21195ffeZqxeyL3fMHbTW4", "local-session"),
    ("ses_ea69411d4ffehAhCZh8fxE6Ku3", "local-session"),
    ("ea69411d4ffehAhCZh8fxE6Ku3", "local-session"),
]

PATH_REPLACEMENTS = [
    (
        "/home/ext_root/lab-data/zetaris-getting-started",
        "$ZETARIS_REPO",
    ),
    (
        "/home/ext_root/lab-data/ai-suite",
        "$AI_SUITE",
    ),
    (
        "/home/ext_root/lab-data/zetaris-platform",
        "$ZETARIS_PLATFORM",
    ),
    (
        "/home/ext_root/lab-data/zetaris-drivers",
        "$ZETARIS_DRIVERS",
    ),
    (
        "/home/ext_root/lab-data/ndp-jdbc-driver-2.1.0.13-driver.jar",
        "$ZETARIS_JDBC_JAR",
    ),
    (
        "/home/ext_root/lab-data/ndp-jdbc-driver-2.4.3.1-7eff043-driver.jar",
        "$ZETARIS_JDBC_JAR",
    ),
    ("/home/ext_root/lab-data", "$LAB_DATA"),
    ("/Users/dk/lab-data/ai-suite", "$AI_SUITE"),
    ("/Users/dk/lab-data/zetaris-getting-started", "$ZETARIS_REPO"),
    ("/Users/dk/lab-data", "$LAB_DATA"),
    ("/Users/dk/...", "$HOME/..."),
    ("/Users/dk", "$HOME"),
    ("/home/linuxbrew/.linuxbrew/bin/markdownlint-cli2", "markdownlint-cli2"),
    ("/home/ext_root", "$HOME"),
]

LOCAL_LINK = re.compile(r"(?<!!)\[([^\]]+)\]\(([^)]+)\)")
IMAGE_LINK = re.compile(r"!\[([^\]]*)\]\(([^)]+)\)")


def sanitize(text: str) -> str:
    for old, new in FILENAME_REPLACEMENTS:
        text = text.replace(old, new)
    for old, new in SESSION_REPLACEMENTS:
        text = text.replace(old, new)
    for old, new in PATH_REPLACEMENTS:
        text = text.replace(old, new)
    text = text.replace("$ZETARIS_REPO/scratch", "$SCRATCH")
    text = text.replace("$AI_SUITE/scratch", "$SCRATCH")
    text = text.replace("scratch/", "$SCRATCH/")
    return text


def flatten_local_links(text: str) -> str:
    def link(match: re.Match[str]) -> str:
        target = match.group(2)
        if target.startswith(("http://", "https://", "mailto:", "#", "$")):
            return match.group(0)
        return match.group(1)

    text = LOCAL_LINK.sub(link, text)
    text = IMAGE_LINK.sub(lambda match: match.group(1), text)
    return text


def main() -> None:
    for source, destination in COPIES:
        if not source.is_file():
            raise SystemExit(f"missing source: {source}")
        destination.parent.mkdir(parents=True, exist_ok=True)
        text = source.read_text(encoding="utf-8")
        text = flatten_local_links(sanitize(text))
        destination.write_text(text, encoding="utf-8")
        print(f"{source} -> {destination}")


if __name__ == "__main__":
    main()
