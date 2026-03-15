export async function generatePhotostrip(photos) {
    
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    const width = 400
    const height = photos.length * 300 + 60

    canvas.width = width
    canvas.height = height

    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, width, height)

    let y = 20

    for (let photo of photos) {

        const img = new Image()
        img.src = photo

        await new Promise((resolve) => {
            img.onload = resolve
        })

        ctx.drawImage(img, 20, y, 360, 260)

        y += 300

    }

    return canvas.toDataURL("image/png")

}