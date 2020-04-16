from django.shortcuts import render

from django.shortcuts import render_to_response
from django.http import HttpResponse,JsonResponse
from django.views.decorators.csrf import csrf_exempt

import subprocess
import pandas as pd
import random,string
import os

server="cosbi7"

def browse(request):        
    folder_id=request.GET.get("id","")
    return render_to_response('browse.html',locals())

def savefile(file1,name,id_path):
    file_path = id_path+name

    with open(file_path,'wb') as f:
        for temp in file1.chunks():
            f.write(temp)

@csrf_exempt
def uploadfile(request):
    print(request)
    media_path = '/home/bba753951/Django/master_project/media/uploadfile/'
    script_folder = '/home/bba753951/Django/master_project/BROWSE/script/'



    print("upload---------------\n\n\n")
    if request.method == 'POST':

        RNAfold_MFE = request.POST.get("RNAfold_MFE")
        RNAup_score = request.POST.get("RNAup_score")
        GU_target_score = request.POST.get("GU_target_score")
        mtype = request.POST.get("mtype")
        filetype = request.POST.get("filetype")

        print(mtype)
        print(filetype)

        if filetype=="ID":
            folder_id = request.POST.get("folder_id")
            print("========folder_id:",folder_id)
            id_path=media_path+folder_id+"/"
            task_id=folder_id
        else:
            upload_file = request.FILES.get('upload_file')
            task_id="".join(random.choice(string.ascii_letters+string.digits) for x in range(10))
            id_path=media_path+task_id+"/"
            print("task_id=======",task_id)
            subprocess.call("mkdir "+id_path, shell=True)
            savefile(upload_file,"upload.zip",id_path)
            command1="bash {}un_zip2.sh {}upload.zip".format(script_folder,id_path)
            subprocess.call(command1, shell=True)

        # command2="zip {0}download.zip {0}original.csv {0}step6*.csv".format(id_path)
        # print("command2:::",command2)
        # subprocess.call(command2, shell=True)

        if not RNAfold_MFE:
            RNAfold_MFE="None"

        if not RNAup_score:
            RNAup_score="None"

        if not GU_target_score:
            GU_target_score="None"

        if not os.path.isdir(id_path):
            raise KeyError

        print("------------------------")
        command="bash {4}step6.sh -i {0}original.csv -o {0}step6.csv -t {0}transcript.csv -r {0}regulator.csv -p {1} -u {2} -f {3}".format(id_path,GU_target_score,RNAup_score,RNAfold_MFE,script_folder)
        print(command)
        subprocess.call(command, shell=True)
        subprocess.call("bash {}merge_step6_gene.sh {}".format(script_folder,id_path), shell=True)




        column_name=[]
        if mtype=="regulator":
            column_name=[{"title":"Regulator Name"},
                         {"title":"Transcript Sum"},
                         {"title":"Transcript Name"}]
        else:

            if os.path.isfile(id_path+"gene_file.csv"):
                print("gene_file exist")
                column_name=[{"title":"Gene Name"},
                             {"title":"Transcript Name"},
                             {"title":"Regulator Sum"},
                             {"title":"Regulator Name"}]
            else:
                print("gene_file not exist")
                column_name=[{"title":"Transcript Name"},
                             {"title":"Regulator Sum"},
                             {"title":"Regulator Name"}]
    return JsonResponse({"data":column_name,"userID":task_id})


def showSeq(seq1,seq2):

    seq2=seq2[::-1]

    count=0
    gu_pos=[]
    ngu_pos=[]
    bulge_pos=[]
    for i in zip(seq1,seq2):
        print(""*15)
        i=set(i)
        print(i)
        if i == {'G','U'} or i == {'G','T'}:
            gu_pos.append(count)
        elif i == {'A','T'} or i == {'C' ,'G'} or i == {'A','U'}:
            pass
        elif "-" in i:
            bulge_pos.append(count)
        else:
            ngu_pos.append(count)

        count += 1


    result_seq2=""
    for i in range(len(seq2)):
        if i in gu_pos:
            result_seq2+='<span class="gu">'+seq2[i]+'</span>'
        elif i in ngu_pos:
            result_seq2+='<span class="ngu">'+seq2[i]+'</span>'
        elif i in bulge_pos:
            result_seq2+='<span class="bulge">'+seq2[i]+'</span>'
        else:
            result_seq2+=seq2[i]

    result="5'"+seq1+"3'<br>3'"+result_seq2+"5'"
    return result

def search1(outfile,userID):
    media_path = '/home/bba753951/Django/master_project/media/uploadfile/'+userID+"/"
    data = pd.read_csv(media_path+outfile)


    data["RNAup_target_seq"]=data.apply(lambda x :showSeq(x["RNAup_target_seq"],x["RNAup_input_seq"]),axis=1)


    hybrid_info=["hybrid_seq","hybrid_len","reg_hyb_target_pos","remain_pos"]
    show_info=["hybrid0","read_count","RNAfold_MFE","regulator_name","regulator_seq","regulator_len","rem_tran_target_pos","RNAup_pos","RNAup_score","RNAup_target_seq"]
    tran_info=["transcript_name","transcript_len"]
    GU_info=["GU_target_position","xGU_inseed","GU_inseed","xGU_outseed","GU_outseed","total_mismatch","xGU_misPos","GU_misPos"]
    gu_exist=0

    data=data.fillna("")

    tdata=[]
    tcolumn=[]
    h_info=[hybrid_info]
    g_info=[GU_info]
    pre_pos_array=[]
    pos_array=[]

# do not need to use copy
# bcz need dynamic change
    pos_info=[show_info]

    transcript_len=int(data.loc[0,"transcript_len"])
    transcript_info=[tran_info,list(data.loc[0,tran_info])]

    if "GU_targeting_score" in data.columns:
        gu_exist=1
        show_info.append("GU_targeting_score")
        for i in data.index:
            g_info.append(list(data.loc[i,GU_info]))

    for i in data.index:
        show_list=list(data.loc[i,show_info])
#
        pos_info.append(show_list.copy())
        show_list.insert(0,i)
        tdata.append(show_list)

        #h_info
        h_info.append(list(data.loc[i,hybrid_info]))

# hybrid_info for hybrid id
    tcolumn.append({"title":"hybrid_info"})
    for i in show_info:
        tcolumn.append({"title":i.replace("_"," ")})

#-------------- pos array ----------------
    pre_pos_array=data["RNAup_pos"]
# pre_pos_array=["1-10","2-5","1-4","5-6"]
    for i in range(len(pre_pos_array)):
        pos_split = list(map(int,pre_pos_array[i].split("-")))
        pos_split.insert(0,i)
        pos_array.append(pos_split)

    pos_array.sort(key=lambda x: [x[1],x[2]])

# caculate level layer

    level = 0
    max_level = 0
    level_lastPos = [0]

    for i in pos_array:
        # index 2 mean ending pos
        level=0
        while(True):
            if i[1] >= level_lastPos[level]:   
                level_lastPos[level]=i[2]
                i.append(level+1)
                if level > max_level:
                    max_level = level
                break
            else:
                level+=1
                if(len(level_lastPos)==level):
                    level_lastPos.append(i[2])
                    i.append(level+1)
                    if level > max_level:
                        max_level = level
                    break

#-------------- result -------------------
    result={}
    result["column"]=tcolumn
    result["data"]=tdata
    result["col_num"]=data.shape[0]
    result["hybrid_info"]=h_info
    result["gu_info"]=g_info
    result["gu_exist"]=gu_exist
    result["transcript_len"]=transcript_len
    result["transcript_info"]=transcript_info
    result["pos_info"]=pos_info
    result["pos_array"]=pos_array
    result["max_level"]=max_level+1
    return result


def search2(name,userID):
    media_path = '/home/bba753951/Django/master_project/media/uploadfile/'+userID+"/"
    outfile="ori_reg.csv"
    command='bash /home/bba753951/Django/master_project/BROWSE/script/search_name.sh "{}" original.csv {} {}'.format(name,outfile,userID)
    subprocess.call(command,shell=True)

    data = pd.read_csv(media_path+outfile,usecols=["transcript_name"])
    groups = data.groupby(data["transcript_name"])

    table=[]
    for name,group in groups:
        table.append([name,len(group),0])

    return table

def copy_example(request):
    media_path = '/home/bba753951/Django/master_project/media/uploadfile/example'
    subprocess.call("mkdir "+media_path, shell=True)
    example_path = '/home/bba753951/Django/master_project/media/example_data/'
    command='cp {}* {}'.format(example_path,media_path)
    subprocess.call(command,shell=True)
    return JsonResponse({"data":"ok"})


def site_link(request):
    name=request.GET.get("name")
    mtype=request.GET.get("mtype")
    reg_name=request.GET.get("regulator")
    userID=request.GET.get("userID")
    search_file=request.GET.get("sfile")+".csv"
    tTitle=""
    
    if not userID:
        userID="example"

    print(mtype)
    if mtype=="transcript":
        outfile="table.csv"
        command='bash /home/bba753951/Django/master_project/BROWSE/script/search_name.sh "{}" {} {} {}'.format(name,search_file,outfile,userID)
        subprocess.call(command,shell=True)
        result=search1(outfile,userID)
    elif mtype=="regulator":
        print("----------------------")
        print(name)
        result=search2(name,userID)
        return render_to_response('reg_tran.html',locals())

    if reg_name:
        tTitle="Browse Regulator({}) on Transcript({}) Detail".format(reg_name,name)
    else:
        tTitle="Browse Transcript({}) Detail".format(name)

    return render_to_response('site_table.html',locals())



def usage(request):
    return render_to_response('usage.html',locals())


@csrf_exempt
def usage_upload(request):
    media_path = '/home/bba753951/Django/master_project/media/uploadfile/'
    info_path = '/home/bba753951/Django/master_project/media/info/'
    script_folder = '/home/bba753951/Django/master_project/BROWSE/script/'

    task_id="".join(random.choice(string.ascii_letters+string.digits) for x in range(10))
    id_path=media_path+task_id+"/"
    print(request.method)
    print("task_id=======",task_id)


    print("upload---------------\n\n\n")
    if request.method == 'POST':
        hyb_file = request.FILES.get('zip_file')
        # tran_file = request.FILES.get('transcript_file')
        # reg_file = request.FILES.get('regulator_file')
        # gene_file = request.FILES.get('gene_file')


        RNAfold_MFE = request.POST.get("RNAfold_MFE","None")
        RNAup_score = request.POST.get("RNAup_score","None")
        GU_target_score = request.POST.get("GU_target_score","None")

        hyb_len = request.POST.get("hyb_len",17)
        rem_len = request.POST.get("rem_len",15)

        mail = request.POST.get("mail")

        readCount = request.POST.get("readCount",5)
        adaptor = request.POST.get("adaptor","None")

        reg_hyb_mis = request.POST.get("reg_hyb_mis",0)
        rem_tran_mis = request.POST.get("rem_tran_mis",0)

        subprocess.call("mkdir "+id_path, shell=True)
        print("mkdir")
        # savefile(tran_file,"tran_file_file.csv",id_path)
        # print("save1")
        # savefile(reg_file,"reg_file.csv",id_path)
        # print("save2")
        savefile(hyb_file,"upload.zip",id_path)
        print("save3")
        if not adaptor:
            adaptor="None"

        if not RNAfold_MFE:
            RNAfold_MFE="None"

        if not RNAup_score:
            RNAup_score="None"

        if not GU_target_score:
            GU_target_score="None"

        if not reg_hyb_mis:
            reg_hyb_mis=0

        if not rem_tran_mis:
            rem_tran_mis=0

        if not readCount:
            readCount="None"

        if not rem_len:
            rem_len=15

        if not hyb_len:
            hyb_len=17


        command="bash {}changeState.sh {} {} {}".format(script_folder,task_id,1,2) 
        command1="bash {}un_zip.sh {}upload.zip".format(script_folder,id_path)
        command2='bash {0}pipeline -f {1}hyb_file.fastq -t {1}tran_file.csv -r {1}reg_file.csv -g {1}gene_file.csv -a {2} -o {1}output.csv -l {3} -C {4} -F {5} -U {6} -G {7} -L {8} -m {9} -M {10} -b 1 -B 1 -p 1'.format(script_folder,id_path,adaptor,hyb_len,readCount,RNAfold_MFE,RNAup_score,GU_target_score,rem_len,reg_hyb_mis,rem_tran_mis)
        command3="bash {}changeState.sh {} {} {}".format(script_folder,task_id,2,3) 
        command4='echo "Your analysis is completed,and your file ID is {0}.\n Or you can click this link to see result http://{2}.ee.ncku.edu.tw/master_project/browse?id={0}" | mail -s "Analysis completed from {2}" -a "From: CosbiLab <bba753951@{2}.ee.ncku.edu.tw>" {1}'.format(task_id,mail,server)
        command5="bash {}schedule.sh".format(script_folder) 

        print(command2)
        with open(id_path+"run.sh","w") as fp:
            fp.write(command+"\n")
            fp.write(command1+"\n")
            fp.write(command2+"\n")
            fp.write(command3+"\n")
            fp.write(command4+"\n")
            fp.write(command5+"\n")

        with open(info_path+"info.csv","a+") as fp:
            fp.write(task_id+","+mail+",0\n")


        infoTxt="<span class='info'>Adaptor Sequence: {}<br><br>Hybrid Length (greater equeal): {} <br><br> Read count (greater equal): {} <br><br> RNAfold_MFE (less equal): {}<br><br>Reg_Hyb Mismatch: {}<br><br>Remaining Sequence Length (greater equal): {} <br><br> Rem_Tran Mismatch: {}<br><br> RNAup_score(less equal): {} <br><br>GU_target_score (greater equal): {}</span>".format(adaptor,hyb_len,readCount,RNAfold_MFE,reg_hyb_mis,rem_len,rem_tran_mis,RNAup_score,GU_target_score)
        with open(id_path+"info_para.txt","w") as fp:
            fp.write(infoTxt)
            
        confirm_command='echo "if you want to start your analysis,please click this link http://{2}.ee.ncku.edu.tw/master_project/browse/confirmMail?id={0}" | mail -s "Confirm mail from {2}" -a "From: CosbiLab <bba753951@{2}.ee.ncku.edu.tw>" {1}'.format(task_id,mail,server)
        print(confirm_command)
        subprocess.call(confirm_command, shell=True)

    return JsonResponse({"data":"ok","userID":task_id})


# when user confirm mail,change info.csv from 0 to 1
def confirmMail(request):
    folder_id=request.GET.get("id")
    info_path = '/home/bba753951/Django/master_project/media/info/'
    print("========confirm===========")

    data=pd.read_csv(info_path+"info.csv",header=None,index_col=0)
    data.loc[folder_id,2]=1
    data.to_csv(info_path+"info.csv",header=0)
    command="bash /home/bba753951/Django/master_project/BROWSE/script/schedule.sh"
    subprocess.call(command, shell=True)
    return render_to_response('confirm.html',locals())


