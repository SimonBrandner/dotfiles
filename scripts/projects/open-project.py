#!/usr/bin/env python

from utils import PROJECTS_PATH
import subprocess
import os


def open_project_in_neovim(project_directory: str):
    try:
        os.chdir(project_directory)
    except Exception as e:
        print(f"There was an error changing directory to project directory: {e}")
        return

    try:
        os.execvp("direnv", ["direnv", "exec", ".", "nvim", "."])
    except Exception as e:
        print(f"Failed to start direnv and neovim: {e}")
        return


def remove_project_from_file(project_directory: str):
    try:
        with open(PROJECTS_PATH, "r") as file:
            lines = file.readlines()
        with open(PROJECTS_PATH, "w") as file:
            for line in lines:
                if line.strip() != project_directory.strip():
                    file.write(line)
    except Exception as e:
        print(f"Failed to remove project from file: {e}")


def open_project() -> bool:
    with open(PROJECTS_PATH, "r") as file:
        projects = file.read()

    try:
        result = subprocess.run(
            ["fzf", "--prompt=Select Project: ", "--expect=ctrl-d", "--cycle"],
            input=projects,
            stdout=subprocess.PIPE,
            text=True,
        )
        output: str = result.stdout.strip()
    except Exception as e:
        print(f"Failed to pick project: {e}")
        return True

    if not output:
        print("No project selected")
        return True

    output_lines = output.split()
    if len(output_lines) == 1:
        open_project_in_neovim(output_lines[0])
        return True
    elif len(output_lines) > 1 and output_lines[0] == "ctrl-d":
        remove_project_from_file(output_lines[1])
        return False

    print("Got to an unexpected state")
    return True


def main():
    while True:
        if open_project():
            break


if __name__ == "__main__":
    main()
