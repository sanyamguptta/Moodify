import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

// init() fn -> for initial setup which is required for mediapipe (for tracking expression)
const init = async () => {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
  );

  landmarkerRef.current = await FaceLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task",
    },
    outputFaceBlendshapes: true,
    runningMode: "VIDEO",
    numFaces: 1,
  });

  const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
  });

  videoRef.current.srcObject = stream;
  await videoRef.current.play();

  // detect();
};

// for detecting faceExpression
const detect = () => {
  if (!landmarkerRef.current || !videoRef.current) return;

  const results = landmarkerRef.current.detectForVideo(
    videoRef.current,
    performance.now(),
  );

  if (results.faceBlendshapes?.length > 0) {
    const blendshapes = results.faceBlendshapes[0].categories;

    const getScore = (name) =>
      blendshapes.find((b) => b.categoryName === name)?.score || 0;

    const smileLeft = getScore("mouthSmileLeft");
    const smileRight = getScore("mouthSmileRight");

    const frownLeft = getScore("mouthFrownLeft");
    const frownRight = getScore("mouthFrownRight");

    const jawOpen = getScore("jawOpen");
    const browUp = getScore("browInnerUp");

    const browDownLeft = getScore("browDownLeft");
    const browDownRight = getScore("browDownRight");

    let currentExpression = "😐 Neutral";

    if (smileLeft > 0.5 && smileRight > 0.5) {
      currentExpression = "😊 Happy";
    } else if (jawOpen > 0.6 && browUp > 0.5) {
      currentExpression = "😲 Surprised";
    } else if (browDownLeft > 0.5 && browDownRight > 0.5) {
      currentExpression = "😠 Angry";
    } else if (frownLeft > 0.5 && frownRight > 0.5) {
      currentExpression = "😢 Sad";
    }

    setExpression(currentExpression);
  }

  animationRef.current = requestAnimationFrame(detect);
};
