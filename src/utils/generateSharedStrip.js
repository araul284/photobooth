export async function generateSharedStrip(myPhotos, partnerPhotos) {

    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    const width = 600
    const height = myPhotos.length * 300 + 60

    canvas.width = width
    canvas.height = height

    ctx.fillStyle = "#fff"
    ctx.fillRect(0, 0, width, height)

    let y = 20

    for (let i = 0; i < myPhotos.length; i++) {
        
        const img1 = new Image()
        img1.src = myPhotos[i]

        const img2 = new Image()
        img2.src = patnerPhotos[i]

        await Promise.all([
            new Promise(res => img1.onload = res),
            new Promise(res => img2.onload = res)
        ])

        ctx.drawImage(img1, 20, y, 260, 260)
        ctx.drawImage(img2, 320, y, 260, 260)

        y += 300

    }
    
    return canvas.toDataURL("image/png")
}