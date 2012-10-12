
#pragma D option quiet

BEGIN
{
	printf("%-22s %-20s %-8s %-16s %-16s %-16s\n",
	  "DIRECTION", "URL", "METHOD", "REMOTEADDRESS", "REMOTEPORT", "BUFFERSIZE");
}

node*:::http-server-request
{
	printf("%-22s %-20s %-8s %-16s %-16d %-16d\n",
	  probename, args[0]->url, args[0]->method, args[1]->remoteAddress,
	  args[1]->remotePort, args[1]->bufferSize);
}

node*:::http-server-response
{
	printf("%-22s %-20s %-8s %-16s %-16d %-16d\n",
	  probename, " ", " ", args[0]->remoteAddress, 
	  args[0]->remotePort, args[0]->bufferSize);
}


