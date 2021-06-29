import sys,json
from MathABS import ABS
from charm.toolbox.pairinggroup import PairingGroup

def main():
    # attributes = ['CHIEF','SCHIEF','FRESHMAN','HRD','DD']
    group = PairingGroup('MNT159')
    absinst = ABS(group)
    data = json.loads(sys.stdin.readline())
    attributes = data['attr'].split(',')
    tpk = absinst.trusteesetup(attributes)
    response = {
        "tpk":absinst.encodestr(tpk)
    }
    print(json.dumps(response))

if __name__ == '__main__':
    main()