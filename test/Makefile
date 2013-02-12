build:
	node -e "var measy=require('./../lib');measy.makeProject(['src'], function (p) {measy.build(p, 'build');});"

test:
	node ../node_modules/tc/bin/tc case

.PHONY : test build