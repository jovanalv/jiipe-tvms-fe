FROM node:18-alpine
# Set working directory di dalam container
WORKDIR /app

# Salin package.json dan package-lock.json
COPY package*.json ./

# Instal dependensi
RUN npm install --force

RUN npm i -g serve

# Salin seluruh kode sumber ke dalam container
COPY . .

# Build aplikasi React
RUN npm run build

# Ekspose port yang digunakan oleh aplikasi (ubah sesuai port yang Anda inginkan, misalnya 3000)
EXPOSE 3011

# Jalankan aplikasi
CMD ["serve", "-s", "dist", "-l", "3011"]