import React, { useRef, useEffect, useState } from 'react'
import { useCallback } from 'react'

const imgURLs = []

const useImageResources = () => {
  const [loadded, setLoaded] = useState(false)
  const map = useRef(new Map())

  useEffect(() => {
    Promise.all(
      imgURLs.map(async (projectile) => {
        return new Promise((resolve) => {
          const img = new Image()
          img.src = projectile
          img.onload = () => {
            console.log('loaded')
            resolve(img)
          }
        })
      }),
    ).then((imgs) => {
      imgs.forEach((img, i) => {
        map.current.set(imgURLs[i], img)
        if (i === imgs.length - 1) setLoaded(true)
      })
    })
  }, [])

  const getResource = useCallback((url) => map.current.get(url), [map])

  const addResource = useCallback((url, img) => map.current.set(url, img), [
    map,
  ])

  return { map: map.current, loadded }
}

// const Canvas = ({ projectiles }) => {
//   const canvasRef = useRef(null)

//   useEffect(() => {
//     const canvas = canvasRef.current
//     const context = canvas.getContext('2d')

//     // Clear canvas before rendering new frame
//     context.clearRect(0, 0, canvas.width, canvas.height)

//     // Render projectiles
//     projectiles.forEach((projectile) => {
//       const img = new Image()
//       img.src = projectile.img
//       img.onload = () => {
//         context.drawImage(img, projectile.x, 700 - projectile.y)
//       }
//     })
//   }, [projectiles])

//   return (
//     <canvas
//       className="canvas"
//       ref={canvasRef}
//       width={1000}
//       height={700}
//     ></canvas>
//   )
// }

function Canvas({ projectiles }) {
  const canvasRef = useRef(null)

  const [images, setImages] = useState([])

  useEffect(() => {
    Promise.all(
      projectiles.map(async (projectile) => {
        return new Promise((resolve) => {
          const img = new Image()
          img.src = projectile.img
          img.onload = () => {
            console.log('loaded')
            resolve({ ...projectile, img })
          }
        })
      }),
    ).then((imgs) => setImages(imgs))
  }, [projectiles])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    const render = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw projectiles
      images.forEach((projectile) => {
        console.log(projectile, projectile.img)
        ctx.drawImage(projectile.img, projectile.x, projectile.y)
      })

      // Request next frame
      requestAnimationFrame(render)
    }

    // Start rendering loop
    requestAnimationFrame(render)
  }, [images])

  return <canvas ref={canvasRef} width={1000} height={700} />
}

export default Canvas
