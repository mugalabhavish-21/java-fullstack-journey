package com.hireflow.api.auth;
import javax.crypto.Mac;import javax.crypto.spec.SecretKeySpec;import java.nio.charset.StandardCharsets;import java.time.Instant;import java.util.Base64;
public class JwtService{
 private static final String SECRET="HireFlow-Interview-Secret-2026-Change-In-Production";
 public String generate(String email,String role){String p=Base64.getUrlEncoder().withoutPadding().encodeToString((email+"|"+role+"|"+(Instant.now().plusSeconds(86400).getEpochSecond())).getBytes(StandardCharsets.UTF_8));return p+"."+sign(p);}
 public String email(String t){return parse(t)[0];} public String role(String t){return parse(t)[1];}
 private String[] parse(String t){try{String[] a=t.split("\\.",2);if(a.length!=2||!a[1].equals(sign(a[0])))throw new IllegalArgumentException();String[] p=new String(Base64.getUrlDecoder().decode(a[0]),StandardCharsets.UTF_8).split("\\|",3);if(p.length!=3||Long.parseLong(p[2])<Instant.now().getEpochSecond())throw new IllegalArgumentException();return p;}catch(Exception e){throw new IllegalArgumentException("Invalid or expired token");}}
 private String sign(String v){try{Mac m=Mac.getInstance("HmacSHA256");m.init(new SecretKeySpec(SECRET.getBytes(StandardCharsets.UTF_8),"HmacSHA256"));return Base64.getUrlEncoder().withoutPadding().encodeToString(m.doFinal(v.getBytes(StandardCharsets.UTF_8)));}catch(Exception e){throw new IllegalStateException(e);}}
}