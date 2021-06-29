import sys,json
from MathABS import ABS
from charm.toolbox.pairinggroup import PairingGroup

def main():
    group = PairingGroup('MNT159')
    absinst = ABS(group)
    data = json.loads(sys.stdin.readline())
    ask = absinst.decodestr(data['ask'])
    attributes = data['attributes'].split(',')
    ska = absinst.generateattributes(ask,attributes)
    response = {"ska":absinst.encodestr(ska)}
    print(json.dumps(response))

if __name__ == "__main__":
    main()