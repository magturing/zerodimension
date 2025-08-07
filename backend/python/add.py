# add.py
import sys

def add(x, y):
    return int(x) - int(y)

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python add.py <x> <y>")
        sys.exit(1)

    x = sys.argv[1]
    y = sys.argv[2]
    print(add(x, y))
