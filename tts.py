from pydub import AudioSegment
import numpy as np

from gtts import gTTS
import os

def generate_silence(milliseconds):
    silence = AudioSegment.silent(duration=milliseconds)
    return silence

# ---------------------------------------------------------------
# ---------------------------------------------------------------
text_E = '''
timetable
timid
tin
tiptoe
tire
tiresome
tiring
'''.split()
text_C = '''
時間表
膽小
錫
腳尖
輪胎
令人厭煩的
累人
'''.split()
repeat = 3
time1 = 1000
time2 = 2000
time3 = 3000
letter = True
C = True

# ---------------------------------------------------------------
# ---------------------------------------------------------------

sound_E = []
sound_C = []
output = generate_silence(500)
print(type(output))
output = AudioSegment.empty()
print(type(output))
for i in range(len(text_C)):

    tE = gTTS(text_E[i])
    tE.save("temp_audio.mp3")
    tE2 = AudioSegment.from_file("temp_audio.mp3")
    tEt = generate_silence(time1)
    output += (tE2+tEt)*repeat

    # tEL = gTTS(",".join(text_E[i]))
    if letter:
        tEL = gTTS(" ".join(text_E[i]))
        tEL.save("temp_audio.mp3")
        tEL2 = AudioSegment.from_file("temp_audio.mp3")
        output += tEL2

    if C:
        tCEt = generate_silence(time2)
        output += tCEt

        tC = gTTS(text_C[i],lang='zh-tw')
        tC.save("temp_audio.mp3")
        tC2 = AudioSegment.from_file("temp_audio.mp3")
        output += tC2
    
    tCt = generate_silence(time3)
    output += tCt

'''
for E in text_E:
    t = gTTS(E)
    sound_E.append(t)
    
for C in text_C:
    t = gTTS(C)
text_CE = '。。。。。'.join([text_E[i]+"\n"+text_C[i] for i in range(len(text_C))])
print(text_CE)
# 创建 gTTS 对象并将文本转换为语音
tts = gTTS(text_CE, lang='zh-tw')
# tts = gTTS(text_CE)
output.save("output.mp3")
'''
output.export("output.wav", format="wav")
os.system("start output.wav")