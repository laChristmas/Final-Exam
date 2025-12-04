#!/bin/bash

# Check number of lines
command=`git diff --stat --cached`
insertions=`echo $command | grep -Eo '[0-9]+ insertions' | sed 's/ insertions//g'`

if [[ "$insertions" -gt 100 ]]; then
  git diff --stat --cached
  echo -e "\033[0;31m"
  echo "================================================================================"
  echo "= Looks like you are trying to commit "$insertions" lines of code                          ="
  echo -n "$(tput bold)"
  echo "= Be careful next time!                                                              ="
  echo -n "$(tput sgr0)"
  echo -e -n "\033[0;31m"
  echo "================================================================================"
  echo -e "\033[0m"
fi

