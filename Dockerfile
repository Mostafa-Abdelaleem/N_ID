FROM python:3.7-slim
COPY . /app
WORKDIR /app
RUN apt-get update \
  && apt-get install -y gcc build-essential tesseract-ocr libxtst6 libglib2.0-0 libsm6 libfontconfig1 libxrender1

RUN pip3 install tensorflow==1.14.0 opencv-python pytesseract
RUN pip3 install -r requirements.txt

EXPOSE 8080
CMD ["python","IDAPP.py"]
