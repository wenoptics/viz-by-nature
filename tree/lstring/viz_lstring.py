tree_string = """
l[+L][-L][+L[+LL][-LL]l][-+lL]
""".strip()


stack = []
out = ''
indent = 0


def make_indent(n):
    return ''.join([' ']*n*2)


for s in tree_string:
    if s == '[':
        indent += 1
        out += '\n' + make_indent(indent) + s
    elif s == ']':
        indent -= 1
        out += s + '\n' + make_indent(indent)
    else:
        out += s

print(out)
