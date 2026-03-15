import { applyVintageFilter } from "./applyVintageFilter"

export function captureFrame(videoElement) {

    const canvas = document.createElement("canvas")

    canvas.width = videoElement.videoWidth
    canvas.height = videoElement.videoHeight

    const ctx = canvas.getContext("2d")

    ctx.drawImage(videoElement, 0, 0)

    applyVintageFilter(canvas, ctx)

    return canvas.toDataURL("image/png")
    
}