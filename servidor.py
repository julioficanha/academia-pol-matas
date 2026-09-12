#!/usr/bin/env python3
"""Servidor estático com suporte a Range.

O `python3 -m http.server` responde 200 com o arquivo inteiro quando o
navegador pede um trecho, e é por isso que o <video> não toca nem deixa
arrastar a linha do tempo. Aqui o 206 Partial Content existe.
"""
import os, re, sys
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

class ComRange(SimpleHTTPRequestHandler):
    protocol_version = 'HTTP/1.1'

    def send_head(self):
        faixa = self.headers.get('Range')
        if not faixa:
            return super().send_head()
        caminho = self.translate_path(self.path)
        if os.path.isdir(caminho):
            return super().send_head()
        m = re.match(r'bytes=(\d*)-(\d*)$', faixa.strip())
        if not m:
            return super().send_head()
        try:
            f = open(caminho, 'rb')
        except OSError:
            self.send_error(404)
            return None
        total = os.fstat(f.fileno()).st_size
        ini, fim = m.group(1), m.group(2)
        if ini == '':                        # bytes=-N  (últimos N)
            tam = min(int(fim or 0), total)
            ini, fim = total - tam, total - 1
        else:
            ini = int(ini)
            fim = int(fim) if fim else total - 1
        if ini >= total or ini > fim:
            f.close()
            self.send_response(416)
            self.send_header('Content-Range', f'bytes */{total}')
            self.send_header('Content-Length', '0')
            self.end_headers()
            return None
        fim = min(fim, total - 1)
        f.seek(ini)
        self.send_response(206)
        self.send_header('Content-Type', self.guess_type(caminho))
        self.send_header('Content-Range', f'bytes {ini}-{fim}/{total}')
        self.send_header('Content-Length', str(fim - ini + 1))
        self.send_header('Accept-Ranges', 'bytes')
        self.send_header('Cache-Control', 'no-cache')
        self.end_headers()
        return TrechoDeArquivo(f, fim - ini + 1)

    def end_headers(self):
        if 'Accept-Ranges' not in self._headers_buffer_texto():
            self.send_header('Accept-Ranges', 'bytes')
        super().end_headers()

    def _headers_buffer_texto(self):
        return b''.join(getattr(self, '_headers_buffer', []) or []).decode('latin-1')

    def log_message(self, *a):
        pass

class TrechoDeArquivo:
    """Entrega só o pedaço pedido, sem carregar o arquivo todo na memória."""
    def __init__(self, f, restante):
        self.f, self.restante = f, restante
    def read(self, n=-1):
        if self.restante <= 0:
            return b''
        if n is None or n < 0:
            n = self.restante
        dado = self.f.read(min(n, self.restante))
        self.restante -= len(dado)
        return dado
    def close(self):
        self.f.close()

if __name__ == '__main__':
    porta = int(sys.argv[1]) if len(sys.argv) > 1 else 8900
    raiz = sys.argv[2] if len(sys.argv) > 2 else os.path.dirname(os.path.abspath(__file__))
    srv = ThreadingHTTPServer(('127.0.0.1', porta), partial(ComRange, directory=raiz))
    print(f'servindo {raiz} em http://127.0.0.1:{porta}', flush=True)
    srv.serve_forever()
