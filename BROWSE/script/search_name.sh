#!/bin/bash
name=$1
ori=$2
outfile=$3
userID=$4

media_path="/home/bba753951/Django/master_project/media/uploadfile/"$userID
ori_file=${media_path}"/"$2
tablefile=${media_path}"/"$3

head -n 1 $ori_file > $tablefile
grep ",${name}," $ori_file >> $tablefile


#jq -s -R -c -f ${shell_folder}/csv2json.jq ${step6_path}"/temp.csv" > ${step6_path}"/step6_transcript_regulator.json"
