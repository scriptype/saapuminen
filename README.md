# Enes'in saapuminen

I arrive one frame and 384 milliseconds at a time. A countdown timer with style.

<details>
  <summary><h2>Screenshot</h2></summary>
  
  ![Screenshot 2023-08-21 at 13-22-10 Enesin saapuminen](https://github.com/scriptype/saapuminen/assets/5516876/b9cdab7b-6c93-425d-b93e-8a9bcf1b45c8)
</details>

<details>
  <summary><h2>Live</h2></summary>

  Check: https://enes.in/saapuminen
</details>

<details>
  <summary><h2>Video credits</h2></summary>

  - https://player.vimeo.com/video/397390770?title=0&portrait=0&byline=0&autoplay=1&muted=true
  - https://www.youtube.com/watch?v=Vdb9IndsSXk
</details>

<details>
  <summary><h2>Manual</h2></summary>
  
  Frames are obtained from videos using:
  
  ```sh
  ffmpeg -i video.mov -q:v 4 -r 30 frames/frame_%04d.jpg
  ```
  
  - `-q:v 4` sets the quality of output. the lower the number, the higher the quality
  - `-r 30` sets the fps to 30
  - `%04d` is about the naming format of output files. the `04` in between `%` and `d` means use 4 zeroes padding.
  
  Videos are ignored from git.
</details>
