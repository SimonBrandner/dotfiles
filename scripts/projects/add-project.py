#!/usr/bin/env python

from os import getcwd
from utils import PROJECTS_PATH


def main():
    with open(PROJECTS_PATH, "a") as file:
        file.write(getcwd() + "\n")


if __name__ == "__main__":
    main()
