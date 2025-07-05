"use client";

import { useRef, useState } from 'react';

export default function AboutPage() {
  const [videoURL, setVideoURL] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null); // store original file
  const [recordedURL, setRecordedURL] = useState<string | null>(null);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [webcamEnabled, setWebcamEnabled] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [downloadLink, setDownloadLink] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const videoStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const webcamVideoRef = useRef<HTMLVideoElement | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validTypes = ['video/mp4', 'video/webm', 'video/ogg'];
      if (!validTypes.includes(file.type)) {
        alert('Unsupported format. Use MP4, WebM, or Ogg.');
        return;
      }
      setUploadedFile(file);
      const url = URL.createObjectURL(file);
      setVideoURL(url);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleEnableWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      videoStreamRef.current = stream;
      setWebcamEnabled(true);
      if (webcamVideoRef.current) {
        webcamVideoRef.current.srcObject = stream;
      }
      setErrorMessage(null);
    } catch (err) {
      console.error(err);
      setErrorMessage('Permission denied or webcam not available.');
    }
  };

  const toggleRecording = () => {
    if (!isRecording) {
      if (!videoStreamRef.current) return;

      recordedChunksRef.current = [];
      const recorder = new MediaRecorder(videoStreamRef.current);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        setRecordedBlob(blob);
        const url = URL.createObjectURL(blob);
        setRecordedURL(url);
      };

      recorder.start();
      setIsRecording(true);

      // ⏱ Stop automatically after 5 seconds
      setTimeout(() => {
        if (mediaRecorderRef.current?.state === 'recording') {
          mediaRecorderRef.current.stop();
          setIsRecording(false);
        }
      }, 5000);

    } else {
      // If user clicks to stop early
      if (mediaRecorderRef.current?.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
    }
  };

  const uploadVideosToBackend = async () => {
    if (!uploadedFile || !recordedBlob) {
      alert("Both uploaded and recorded videos are required.");
      return;
    }

    const formData = new FormData();
    formData.append("file", recordedBlob, "recorded.webm");
    formData.append("inputfile", uploadedFile);
    formData.append("filename", "output.mp4");

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

    try {
      const response = await fetch(`https://video-registor.onrender.com/upload`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Videos uploaded successfully!");
      } else {
        alert("Upload failed.");
      }

      if (!response.ok) {
        alert("Upload failed.");
        return;
      }
      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      setDownloadLink(downloadUrl);
      alert("Videos processed and ready to download!");
    } catch (error) {
      console.error("Error uploading:", error);
      alert("Upload error.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4 space-y-6">
      <h1 className="text-2xl font-bold">Upload or Record Video</h1>

      <input
        ref={fileInputRef}
        type="file"
        accept="video/mp4,video/webm,video/ogg"
        onChange={handleVideoUpload}
        className="hidden"
      />
      <button
        onClick={handleButtonClick}
        className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded"
      >
        Select Video File
      </button>

      {downloadLink && (
        <a
          href={downloadLink}
          download="result.mp4"
          className="mt-4 bg-green-700 hover:bg-green-800 px-6 py-2 rounded text-white"
        >
          Download Processed Video
        </a>
      )}

      {!webcamEnabled && (
        <button
          onClick={handleEnableWebcam}
          className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded"
        >
          Enable Webcam
        </button>
      )}
      {errorMessage && <p className="text-red-400">{errorMessage}</p>}

      {webcamEnabled && (
        <div className="flex flex-col items-center">
          <video
            ref={webcamVideoRef}
            autoPlay
            muted
            width="480"
            className="rounded shadow mb-2"
          />
          <button
            onClick={toggleRecording}
            className={`px-6 py-2 rounded ${isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
              }`}
          >
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </button>
        </div>
      )}

      {/* Preview Uploaded */}
      {videoURL && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Uploaded Video Preview</h2>
          <video controls width="480" src={videoURL} className="rounded shadow" />
        </div>
      )}

      {/* Preview Recorded */}
      {recordedURL && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Recorded Webcam Preview</h2>
          <video controls width="480" src={recordedURL} className="rounded shadow" />
        </div>
      )}

      {/* Upload to backend */}
      {uploadedFile && recordedBlob && (
        <button
          onClick={uploadVideosToBackend}
          className="bg-yellow-600 hover:bg-yellow-700 px-6 py-2 rounded mt-4"
        >
          Upload Videos to Backend
        </button>
      )}
    </div>
  );
}
