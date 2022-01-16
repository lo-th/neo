<p align="center"><a href="http://lo-th.github.io/neo/"><img src="http://lo-th.github.io/neo/examples/assets/neo.jpg"/></a><br>NEO v0.5.0</p>

neo.js is a lightweight timeline for javascript.

**1 - init engine**
```sh
var neo = new NEO.Timeline({ maxframe:400, fps:60 }).onChange( loop )
```
**2 - add track**
```sh
neo.add('bang', { frame:{ 20:1, 40:1 } })
neo.add('flag', { frame:{ 10:'Welcome', 30:'to', 50:'NEO', 70:'the', 90:'ultimate', 110:'timeline' } })
neo.add('color', { frame:{ 1:0xFFFFFF, 187:0x00FF00, 375:0xFFFF00, 562:0xFF0000, 740:0xFFFFFF } })
```
**3 - feature improvements**

better performance<br>
best video and sound support<br>
more advanced examples<br>
more track option

**4 - other examples**

[**BASE EXAMPLE**](http://lo-th.github.io/neo/index.html)

[**3D EXAMPLE**](http://lo-th.github.io/neo/examples/neo_3d.html)

[**STRESS TEST**](http://lo-th.github.io/neo/examples/neo_stress.html)

[**VIDEO TEST**](http://lo-th.github.io/neo/examples/neo_video.html)

[**MAP TEST**](http://lo-th.github.io/neo/examples/neo_sound.html)

**5 - uil is on npm**
```sh
npm i neo_uil