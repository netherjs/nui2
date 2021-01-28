<?php

$FileFilter = '/^nui-(.+?).css$/';
$OutputFile = 'nui.css';
$OutputType = 'text/css';

////////

$ProjectRoot = dirname(__FILE__);
$Files = NULL;
$File = NULL;
$FP = NULL;

$Stars = fn(Int $Num):String => str_repeat('*',$Num);
$Value = fn(Mixed $Val):Mixed => $Val;

////////

chdir($ProjectRoot);

$Files = array_filter(
	(scandir($ProjectRoot)?:[]),
	(fn($File)=>preg_match($FileFilter,$File))
);

if($FP = fopen($OutputFile,'w')) {
	foreach($Files as $File) {
		fwrite($FP,"/*{$Stars(80-2)}\n");
		fwrite($FP,"** {$File} {$Stars(80-4-strlen($File))}\n");
		fwrite($FP,"{$Stars(78)}*/\n\n");
		fwrite($FP,"{$Value(trim(file_get_contents($File)))}\n\n");
	}
	fclose($FP);
}

header("content-type: {$OutputType}");
echo file_get_contents($OutputFile);
