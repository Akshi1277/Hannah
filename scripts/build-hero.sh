#!/usr/bin/env bash
# Builds assets/hero.mp4 from still keyframes (fallback until a real Runway video is available).
# Each keyframe gets a slow, eased camera move; segments are joined with dissolves.
set -e
FF="${FFMPEG:-ffmpeg}"
K=assets/keyframes
N=66   # frames per segment (2.75s @ 24fps)
X=0.75 # crossfade seconds
e="(0.5-0.5*cos(PI*on/$N))"   # ease-in-out 0..1
seg () { # zoom-from zoom-to px-from px-to py-from py-to
  echo "scale=5504:3072,zoompan=z='$1+($2-$1)*$e':x='(iw-iw/zoom)*($3+($4-$3)*$e)':y='(ih-ih/zoom)*($5+($6-$5)*$e)':d=$N:s=1920x1080:fps=24,setsar=1,format=yuv420p"
}
calc () { awk "BEGIN{print $1}"; }
D=$(calc "$N/24")
o1=$(calc "$D-$X"); o2=$(calc "2*($D-$X)"); o3=$(calc "3*($D-$X)"); o4=$(calc "4*($D-$X)"); o5=$(calc "5*($D-$X)")
"$FF" -v error -y \
  -i $K/k1.png -i $K/k2.png -i $K/k3.png -i $K/k4.png -i $K/k5.png -i $K/k6.png \
  -filter_complex "\
[0]$(seg 1.02 1.30 0.35 0.62 0.45 0.55)[a];\
[1]$(seg 1.10 1.28 0.40 0.55 0.55 0.45)[b];\
[2]$(seg 1.22 1.12 0.30 0.62 0.50 0.45)[c];\
[3]$(seg 1.30 1.04 0.60 0.45 0.60 0.50)[d];\
[4]$(seg 1.32 1.20 0.10 0.80 0.55 0.45)[e];\
[5]$(seg 1.22 1.00 0.55 0.50 0.60 0.50)[f];\
[a][b]xfade=transition=fade:duration=$X:offset=$o1[ab];\
[ab][c]xfade=transition=fade:duration=$X:offset=$o2[abc];\
[abc][d]xfade=transition=fade:duration=$X:offset=$o3[abcd];\
[abcd][e]xfade=transition=fade:duration=$X:offset=$o4[abcde];\
[abcde][f]xfade=transition=fade:duration=$X:offset=$o5,format=yuv420p[v]" \
  -map "[v]" -r 24 -c:v libx264 -preset slow -crf 18 -movflags +faststart assets/hero.mp4
