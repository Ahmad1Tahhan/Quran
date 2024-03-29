<?php

namespace App\Http\Middleware;

use Closure;
use Exception;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException; 

class AdminAuth
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        try{
            $token = JWTAuth::parseToken()->checkOrFail();
            if(!$token)
            return response()->json(['Error' => 'Unauthorized'], 401);
            if($token['role']!='admin')
            return response()->json(['Error'=>'Invalid role type.']);
            
            $request->userId = $token['sub'];
            return $next($request);
            }
            catch(TokenInvalidException $e){
                return response()->json(["Error"=>"Invalid token."]);
            }
            catch(TokenExpiredException $e){
                return response()->json(["Error"=>"Token expired."]);
            }
            catch(Exception $e){
                return response()->json(["Error"=>"Invalid token."]);
            }
    }
}
