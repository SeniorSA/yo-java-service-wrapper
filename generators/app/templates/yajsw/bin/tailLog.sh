#!/usr/bin/env bash
# -----------------------------------------------------------------------------

script_path=$(readlink -f "$0")
wrapper_root_directory=$(dirname $(dirname "$script_path"))
log_file_path="$wrapper_root_directory/log/wrapper.log"

tail -f "$log_file_path"
