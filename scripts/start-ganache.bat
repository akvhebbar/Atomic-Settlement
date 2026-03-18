@echo off
echo Starting Ganache CLI on port 7545...
echo.
echo Make sure you have Ganache installed globally with: npm install -g ganache
echo.
echo Default accounts will be available with 100 ETH each
echo Account 0: 0xc87509a1c067bbde78beb793e6fa76530b6382a4c059091344dd1ae10a3f3e2f5
echo Account 1: 0x22d491Bde2303f2f43325b2108D26f1eAbA1e32b
echo.
ganache --port 7545 --deterministic