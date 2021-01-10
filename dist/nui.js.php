<?php

require(sprintf(
	'%s/vendor/autoload.php',
	dirname(__FILE__,2)
));

$Project = Nether\OneScript\Project::FromFile('nui.js.json');
$Project->Print = TRUE;

$Project->Build();
