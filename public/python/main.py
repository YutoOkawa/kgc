from MathABS import ABS
from charm.toolbox.pairinggroup import PairingGroup
import sys,json

def generate_keyfile(absinst,filename,key,length):
    '''
    鍵をファイルで出力
    各値を各行に出力
    '''
    key_file = open(filename,'w')
    key_data = absinst.encodestr(key)
    # key_data = key_data.replace(', ','\n',length)
    # key_file.write(key_data[1:-1])
    key_file.write(key_data)
    key_file.close()
    print(filename+'を出力しました。')

def read_keyfile(absinst,filename):
    '''
    ファイルから鍵を読み取り鍵を生成
    読み取った値は整形する
    '''
    with open(filename,'r') as f:
        key_enc = f.readlines()
    key_str = key_enc[0]
    # key_str = (''.join(key_enc)).replace('\n',', ')
    # key_str = '{' + key_str + '}'
    key = absinst.decodestr(key_str)
    return key

def setup(absinst,attributes,path):
    '''
    generate tpk, ask and apk
    '''
    tpk = absinst.trusteesetup(attributes)
    ask,apk = absinst.authoritysetup(tpk)
    absinst.generate_keyfile(path+'.tpk',tpk)
    absinst.generate_keyfile(path+'.apk',apk)
    absinst.generate_keyfile(path+'.ask',ask)

def attrgen(absinst,attr,filename,path):
    '''
    ファイルから秘密鍵を読む
    '''
    ask = absinst.read_keyfile(path+'.ask')
    ska = absinst.generateattributes(ask,attr)
    absinst.generate_keyfile(filename,ska)

if __name__ == "__main__":
    group = PairingGroup('MNT159')
    absinst = ABS(group)
    id = 'yuuto'
    path = '../key/'+id
    attributes = ['CHIEF','SCHIEF','FRESHMAN','HRD','DD']
    attribute_table = ['HRD','SCHIEF']
    if len(sys.argv) == 1:
        print('Usage: python3 main.py [-s]:Setup [-g]:generateKey')
        sys.exit()
    else:
        options = sys.argv

    if options[1] == '-s':
        print('setup')
        setup(absinst,attributes,path)
    elif options[1] == '-g':
        print('generateKey')
        print('定義されている属性集合:' + str(attributes))
        print('作成する秘密鍵の属性集合は'+str(attribute_table)+'です。')
        filename = '../key/ska_'
        for i in attribute_table:
            filename += i + '_'
        filename = filename[:-1] + '.key'
        attrgen(absinst,attribute_table,filename,path)
    else:
        print('Unknown option. [-s]:Setup [-g]:generateKey')
