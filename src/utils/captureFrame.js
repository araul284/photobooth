export function captureFrame(videoElement) {
    const canvas = document.createElement("canvas")

    canvas.width = videoElement.videoWidth
    canvas.height = videoElement.videoHeight

    const context = canvas.getContext("2d")

    context.drawImage(videoElement, 0, 0)

    const imageData = canvas.toDataURL("image/png")

    return imageData
}