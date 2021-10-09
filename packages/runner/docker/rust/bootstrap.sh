#!/usr/bin/env ash

# init a new crate
cargo init --name=runner --vcs=none

# add the dependencies
echo 'serde_json = "1"' >> Cargo.toml

# add in a bin entry for the injected user code
cat <<EOF >> Cargo.toml
[[bin]]
name = "runner"
path = "mount/main.rs"
EOF

# move the default main.rs to `mount`, so the initial fetch & build work
# this directory will be masked by the bind mount when run
mv src mount

# fetch and download dependencies
cargo fetch

# perform an initial release build, so all dependencies' artefacts exist and
# don't need to be recompiled when running user code
cargo build --release