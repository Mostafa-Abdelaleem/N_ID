import json
import pytesseract
import cv2
import matplotlib.pyplot as plt
from flask import Flask, request
import requests
import base64
from PIL import Image
import numpy as np
import re
import sys
import io
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
@app.route('/' , methods = ['GET', 'POST', 'DELETE'])

def recog():
    image = request.json['image'][22:]
    #print(image)
    name = request.json['name']
    #print(name)
    # image = image.replace(' ', '+')
    # image = re.sub(r'\s+','+',image)
    print('--------------')
    print(image)
    print('--------------')
    #name= name[:-1]
    print(name)
    imgdata = base64.b64decode(str(image))
    image = Image.open(io.BytesIO(imgdata))
    image_np = np.array(image)

    if name =='name' or name =='address':
        print('lets ocr Name or Add')
        gray = cv2.cvtColor(image_np, cv2.COLOR_BGR2GRAY)
        (thresh, im_bw) = cv2.threshold(gray, 128, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)
        image2 = cv2.resize(im_bw, None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC)
        image2 = cv2.medianBlur(image2, 3)
        image2 = cv2.GaussianBlur(image2,(5,5),0)
        
        x = pytesseract.image_to_string(image2, lang= 'ara')
        '''with open("name.txt", "a") as file_object:
                                # Append 'hello' at the end of file
                                    file_object.write("\n" + x)'''
        #print("OMAK")
        print(x)



        return x
    if name == 'fullid':
        print('lets ocr ID')
        gray = cv2.cvtColor(image_np, cv2.COLOR_BGR2GRAY)
        (thresh, im_bw) = cv2.threshold(gray, 128, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)
        image = cv2.resize(im_bw, None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC)
        image = cv2.medianBlur(image, 3)
        image = cv2.GaussianBlur(image,(5,5),0)
        #contours, hierarchy = cv2.findContours(edged, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
        #cv2.drawContours(image, contours, -1, (255, 255, 255), thickness=cv2.FILLED)
        x = pytesseract.image_to_string(image, lang= 'tur')
        # with open("digits.txt", "a") as file_object:
        # # Append 'hello' at the end of file
        #     file_object.write("\n" + x)
        return x

    return ("None")

app.run("0.0.0.0","8080")
