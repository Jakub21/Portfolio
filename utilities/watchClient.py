import msvcrt
import os
from time import sleep
import subprocess as sp
from shp import MultiSHP
from Namespace import Namespace

cwd = os.getcwd()
clientDirectory = f'{cwd}/client'

shpEntryPoints = ['home', '404']
shpDirectory = f'{clientDirectory}/shp'
htmlDirectory = f'{clientDirectory}/html'

scssEntryPoints = ['index', 'page/home', 'page/404']
scssDirectory = f'{clientDirectory}/scss'
cssDirectory = f'{clientDirectory}/css'


class MultiSCSS:
  def __init__(self):
    self.processes = []

  def add(self, source, target):
    process = sp.Popen(f'powershell sass --no-source-map --watch {source}:{target}')
    self.processes.append(process)

  def stop(self):
    print('[SCSS] Interrupted')
    for sub in self.processes:
      sub.terminate()


shpWatcher = MultiSHP()
for file in shpEntryPoints:
  shpWatcher.add(f'{shpDirectory}/{file}.shp', f'{htmlDirectory}/{file}.html')
shpWatcher.watch(True)

scssWatcher = MultiSCSS()
for file in scssEntryPoints:
  scssWatcher.add(f'{scssDirectory}/{file}.scss', f'{cssDirectory}/{file}.css')

reload = False
while True:
  try:
    sleep(.1)
    if msvcrt.kbhit():
      if msvcrt.getch() in b'Rr':
        reload = True
        break
  except KeyboardInterrupt:
    break

scssWatcher.stop()
shpWatcher.stop()

exit(7 if reload else 0)
