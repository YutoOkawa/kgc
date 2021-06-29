import sys,json
from MathABS import ABS
from charm.toolbox.pairinggroup import PairingGroup

def main():
    attributes = ['CHIEF','SCHIEF','FRESHMAN','HRD','DD']
    group = PairingGroup('MNT159')
    absinst = ABS(group)
    tpk = absinst.trusteesetup(attributes)
    ask,apk = absinst.authoritysetup(tpk)
    response = {
        'tpk':absinst.encodestr(tpk),
        'apk':absinst.encodestr(apk),
        'ask':absinst.encodestr(ask)
    }
    print(json.dumps(response))

if __name__ == "__main__":
    main()