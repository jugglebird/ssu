module Kernel
  def Shell(command, *args)
    output = %x{#{command} #{args.map{|arg| esh(arg)}.join(' ')} 2>&1}
    if $?.exitstatus == 0
      return output
    else
      yield $?.exitstatus, output
    end
  end
end

def esh(string)
  string.gsub(/([ \\'"])/) { "\\#{$1}" }
end

def say(what)
  puts "** #{what}"
end
