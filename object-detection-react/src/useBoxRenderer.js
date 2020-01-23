import { useEffect } from 'react'

const SCORE_DIGITS = 4

const getLabelText = (prediction) => {
  const scoreText = prediction.score.toFixed(SCORE_DIGITS)
  return prediction.class + ', score: ' + scoreText
}

const renderPredictions = (predictions, canvasRef, videoRef, trig) => {
  const ctx = canvasRef.current.getContext('2d')
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  // Font options.
  const font = '16px sans-serif'
  ctx.font = font
  ctx.textBaseline = 'top'
  predictions.forEach(prediction => {
    const x = prediction.bbox[0]
    const y = prediction.bbox[1]
    const width = prediction.bbox[2]
    const height = prediction.bbox[3]
    // Draw the bounding box.
    ctx.strokeStyle = '#00FFFF'
    ctx.lineWidth = 4
    ctx.strokeRect(x, y, width, height)
    // Draw the label background.
    ctx.fillStyle = '#00FFFF'
    const textWidth = ctx.measureText(getLabelText(prediction)).width
    const textHeight = parseInt(font, 10) // base 10
    ctx.fillRect(x, y, textWidth + 4, textHeight + 4)
  })

  predictions.forEach(prediction => {
    const x = prediction.bbox[0]
    const y = prediction.bbox[1]
    // Draw the text last to ensure it's on top.
    ctx.fillStyle = '#000000'
    ctx.fillText(getLabelText(prediction), x, y)
  })

  var obj = [];

  predictions.forEach(prediction => {
    var imageObj = {
      'x': prediction.bbox[0],
      'y': prediction.bbox[1],
      'width': prediction.bbox[2],
      'height': prediction.bbox[3],
      'text': getLabelText(prediction)
    }
    var canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 450;
    var ctx = canvas.getContext('2d');
    //draw image to canvas. scale to target dimensions
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    var imageData = ctx.getImageData(imageObj.x, imageObj.y, imageObj.width, imageObj.height);
    var canvas1 = document.createElement("canvas");
    canvas1.width = imageObj.width;
    canvas1.height = imageObj.height;
    var ctx1 = canvas1.getContext("2d");
    ctx1.rect(0, 0, imageObj.width, imageObj.height);
    ctx1.fillStyle = 'white';
    ctx1.fill();
    ctx1.putImageData(imageData, 0, 0);
    //convert to desired file format
    var dataURI = canvas1.toDataURL('image/png',1); // can also use 'image/png'
    
    if (String(imageObj.text).split(',')[0] == 'Face') {
      var div = document.getElementById('photoDiv');
      var oldpic = div.firstChild;
      if (oldpic) {
        oldpic.replaceWith(canvas1);
      }
      else {
        div.appendChild(canvas1);
      }
    }

    obj.push(imageObj);
    trig(dataURI, String(imageObj.text).split(',')[0]);
  })

  //trig(obj);

}

const detectFrame = async (model, videoRef, canvasRef, trig) => {
  const predictions = await model.detect(videoRef.current)
  //console.log(videoRef);
  renderPredictions(predictions, canvasRef, videoRef, trig)
  requestAnimationFrame(() => {
    detectFrame(model, videoRef, canvasRef, trig)
  })
}

const useBoxRenderer = (model, videoRef, canvasRef, shouldRender, trig) => {
  useEffect(() => {
    if (model && shouldRender) {
      detectFrame(model, videoRef, canvasRef, trig)
    }
  }, [canvasRef, model, shouldRender, videoRef])
}

export default useBoxRenderer
