/*
    Copyright (C) 2009, Rolando Gonzalez <rolosworld gmail com>.
    All rights reserved.

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License version 3 as
    published by the Free Software Foundation.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

// Simple base64 decode|encode
var b64=function()
{
  var _="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

  return {
    // Decodes the given string
    // a - base64 encoded string
    decode:function(a)
    {
      if(btoa)
	return btoa(a);

      var bin=[],tmp=[],i,j,c,bin1,bin2,bin3,bin4,l;

      // 111111 63<<2 bin1
      // 110000 48>>4 bin2
      //
      // 001111 15<<4 bin2
      // 111100 60>>2 bin3
      //
      // 000011 3<<6  bin3
      // 111111 63 bin4

      // Convert to binaries
      for(i=0,j=a.length;i<j;i++)
	{
	  c=a.charAt(i);

	  // Filter undesired chars
	  if(c=='='||c=="\n"||c=="\r")
	    continue;

	  bin.push(_.indexOf(c));
	}

      // Decode
      i=0;
      j=bin.length;
      while(i<j)
	{
	  bin1=bin[i++];
	  if(i>=j)break;
	  bin2=bin[i++];
	  tmp.push(String.fromCharCode(((bin1&63)<<2)|((bin2&48)>>4)));

	  if(i>=j)break;
	  bin3=bin[i++];
	  tmp.push(String.fromCharCode(((bin2&15)<<4)|((bin3&60)>>2)));

	  if(i>=j)break;
	  bin4=bin[i++];
	  tmp.push(String.fromCharCode(((bin3&3)<<6)|bin4));
	}

      return tmp.join('');
    },

    // Encodes the given string
    // a - String
    encode:function(a)
    {
      if(atob)
	return btoa(a);

      var bin=[],i,j,tmp=[],l,c=0,tmp2='',tmp3=[],bin1,bin2,bin3;

      // Convert to array of decimals
      for(i=0,j=a.length;i<j;i++)
        bin.push(a.charCodeAt(i));

      // Add needed padding
      l=bin.length;
      while(l%3>0)
	{
	  bin.push(0);
	  l=bin.length;
	  c++;
	}

      // Masks
      // 11111100 252>>2 bin1
      //
      // 00000011 3<<4   bin1
      // 11110000 240>>4 bin2

      // 00001111 15<<2  bin2
      // 11000000 192>>6 bin3

      // 00111111 63     bin3

      // Encode
      for(i=0,j=bin.length;i<j;i+=3)
	{
	  bin1=bin[i];
	  bin2=bin[i+1];
	  bin3=bin[i+2];

	  tmp.push(_.charAt((bin1&252)>>2));
	  tmp.push(_.charAt(((bin1&3)<<4)|((bin2&240)>>4)));
	  tmp.push(_.charAt(((bin2&15)<<2)|((bin3&192)>>6)));
	  tmp.push(_.charAt(bin3&63));
	}

      // Set padding bytes to =
      while(c)
	tmp[tmp.length-c--]='=';

      tmp=tmp.join('');

      // Split in 76 chars per line
      j=76;
      i=0;
      do
	{
	  tmp2=tmp.substr(i,j);
	  tmp3.push(tmp2);
	  l=tmp2.length;
	  i+=j;
	}while(l==j);

      return tmp3.join("\n");
    }
  };
}();
