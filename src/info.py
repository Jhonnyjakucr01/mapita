import pdfplumber
import re
import unicodedata

# Ruta al archivo PDF
pdf_path = "/Users/Dell/Desktop/TesisApp 1.2/public/Data/ICVCOMUNAS2019.pdf"

# Expresión regular para capturar comunas y el comienzo de la lista de barrios
comuna_pattern = re.compile(r"comuna\s+(\d+)", re.IGNORECASE)
barrios_inicio_pattern = re.compile(r"Está conformada por\s*\d*\s*barrios?:", re.IGNORECASE)

# Estructura para almacenar los datos
comunas_info = {}

def limpiar_texto(texto):
    # Eliminar acentos y caracteres especiales
    texto = unicodedata.normalize('NFD', texto)
    texto = texto.encode('ascii', 'ignore').decode("utf-8")
    # Eliminar caracteres específicos
    texto = re.sub(r"[\"\'\(\)\-\_\`]", "", texto)
    return texto.strip()

# Abrir y leer el PDF
with pdfplumber.open(pdf_path) as pdf:
    # Recorremos cada página del PDF
    for page_num, page in enumerate(pdf.pages, start=1):
        text = page.extract_text() 
        
        if text:  # Verificar si la página contiene texto
            lines = text.split('\n')
            current_comuna = None
            capturando_barrios = False
            barrios_acumulados = ""
            
            # Recorremos cada línea de la página
            for line in lines:
                # Buscar la comuna en la línea
                comuna_match = comuna_pattern.search(line)
                if comuna_match:
                    current_comuna = comuna_match.group(1)
                    # Inicializar lista de barrios para esta comuna si es nueva
                    if current_comuna not in comunas_info:
                        comunas_info[current_comuna] = []
                    print(f"Página {page_num}: Encontrada Comuna {current_comuna}")

                # Verificar si inicia la lista de barrios
                if current_comuna and barrios_inicio_pattern.search(line):
                    capturando_barrios = True
                    barrios_acumulados = line
                    continue

                # Continuar acumulando líneas para completar la lista de barrios
                if capturando_barrios:
                    barrios_acumulados += " " + line.strip()
                    # Verificar si llegamos al final de la lista
                    if '.' in line or 'y ' in line:
                        capturando_barrios = False
                        
                        # Extraer y limpiar la lista de barrios
                        barrios_texto = barrios_acumulados.split(':')[1]  # Obtener solo la lista después de ":"
                        barrios = [limpiar_texto(b.strip()) for b in re.split(r',|\sy\s', barrios_texto) if b.strip()]
                        comunas_info[current_comuna].extend(barrios)
                        print(f"Página {page_num}: Barrios en Comuna {current_comuna} - {barrios}")
                        barrios_acumulados = ""

# Mostrar los resultados agrupados por comuna
for comuna, barrios in comunas_info.items():
    print(f"\nComuna {comuna}:")
    print(", ".join(barrios))
