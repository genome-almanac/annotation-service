#!/bin/bash
set -e

# cd to project root directory
cd "$(dirname "$(dirname "$0")")"

source ./scripts/setup-environment.sh

# Build the importer executable
echo "Building importer..."
../importer/scripts/build.sh

# Run Postgres
echo "Running docker-compose dependencies..."
docker-compose -f docker-compose.deps.yml up -d

# TODO: Add something that waits for postgres to be up.
until docker exec service_postgrestest_1 psql -c "select 1" --user postgres > /dev/null 2>&1; do
    sleep 2;
done

# Run Importer
echo "Running importer..."
chmod 755 ../importer/build/annotations-importer-*.jar
java -jar ../importer/build/annotations-importer-*.jar \
    --db-url jdbc:postgresql://$POSTGRES_HOST:$POSTGRES_PORT/$POSTGRES_DB \
    --db-username $POSTGRES_USER \
    --db-schema $POSTGRES_SCHEMA \
    --cytoband-files test-resources/cytoBand.hg38.txt.gz \
    --cytoband-file-assemblies hg38 \
    --assembly-files test-resources/downloads.html \
    --replace-schema

echo "Dependencies started successfully!"
