import pandas as pd
from opencage.geocoder import OpenCageGeocode

API_KEY = "c745a2538d1e4e82808a5480649a19b6"
geocoder = OpenCageGeocode(API_KEY)

input_file = "/Users/FARMART/Desktop/TesisApp 1.2/TesisApp 1.2/public/Data/estatuas-y-monumentos-en-santiago-de-cali-2020-2021.csv"
output_file = "/Users/FARMART/Desktop/TesisApp 1.2/TesisApp 1.2/public/Data/coordenas-monumentos.csv"

# Cargar el archivo CSV
df = pd.read_csv(input_file, sep=';', encoding='latin1')  # Ajusta 'sep' según tu archivo
print("Nombres de columnas en el archivo CSV:", df.columns)

# Normaliza los nombres de las columnas
df.columns = df.columns.str.strip().str.lower()  # Convierte los nombres a minúsculas y elimina espacios

# Verifica si las columnas requeridas existen
required_columns = ['nombre', 'direccion', 'comuna']
missing_columns = [col for col in required_columns if col not in df.columns]
if missing_columns:
    raise KeyError(f"Faltan las columnas requeridas: {missing_columns}. Nombres disponibles: {df.columns}")

# Inicialización de listas para almacenar coordenadas
latitudes = []
longitudes = []

# Itera sobre las direcciones y convierte a coordenadas
for direccion in df['direccion']:
    try:
        result = geocoder.geocode(direccion)
        if result:
            latitudes.append(result[0]['geometry']['lat'])
            longitudes.append(result[0]['geometry']['lng'])
        else:
            latitudes.append(None)
            longitudes.append(None)
    except Exception as e:
        latitudes.append(None)
        longitudes.append(None)
        print(f"Error al procesar {direccion}: {e}")

# Agregar columnas de latitud y longitud al DataFrame
df['latitud'] = latitudes
df['longitud'] = longitudes

# Filtrar las columnas requeridas
filtered_df = df[['nombre', 'direccion', 'comuna', 'latitud', 'longitud']]

# Guarda el archivo actualizado como CSV con un delimitador adecuado
filtered_df.to_csv(output_file, index=False, encoding='utf-8', sep=';')  # Usa sep=';' para separar por punto y coma
print(f"Archivo guardado en {output_file}")
